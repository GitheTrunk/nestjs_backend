import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apolloClient } from '@/apollo/client'
import { GET_TODOS, ADD_TODO, TOGGLE_TODO, DELETE_TODO, TODOS_SUB } from '@/graphql/todos'

export type Todo = {
  __typename?: 'todos'
  id: string
  title: string
  is_done: boolean
  created_at: string
}

type TodosQuery = {
  todos: Todo[]
}

type AddTodoMutation = {
  insert_todos_one: Todo | null
}

type ToggleTodoMutation = {
  update_todos_by_pk: Pick<Todo, '__typename' | 'id' | 'is_done'> | null
}

type DeleteTodoMutation = {
  delete_todos_by_pk: Pick<Todo, '__typename' | 'id'> | null
}

function sortNewestFirst(items: Todo[]) {
  return [...items].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}

function createOptimisticId() {
  return crypto.randomUUID()
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function writeTodosCache(nextTodos: Todo[]) {
    apolloClient.cache.writeQuery<TodosQuery>({
      query: GET_TODOS,
      data: { todos: sortNewestFirst(nextTodos) },
    })
  }

  function setTodos(nextTodos: Todo[]) {
    todos.value = sortNewestFirst(nextTodos)
    writeTodosCache(todos.value)
  }

  async function fetchTodos() {
    loading.value = true
    error.value = null
    try {
      const { data } = await apolloClient.query<TodosQuery>({
        query: GET_TODOS,
        fetchPolicy: 'network-only', // keep it simple for students
      })
      setTodos(data.todos)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load todos'
    } finally {
      loading.value = false
    }
  }

  async function addTodo(title: string) {
    const clean = title.trim()
    if (!clean) return

    const optimisticTodo: Todo = {
      __typename: 'todos',
      id: createOptimisticId(),
      title: clean,
      is_done: false,
      created_at: new Date().toISOString(),
    }
    const previousTodos = todos.value

    setTodos([optimisticTodo, ...previousTodos])

    try {
      const { data } = await apolloClient.mutate<AddTodoMutation>({
        mutation: ADD_TODO,
        variables: { title: clean },
        optimisticResponse: {
          insert_todos_one: optimisticTodo,
        },
        update(cache, { data }) {
          const addedTodo = data?.insert_todos_one
          if (!addedTodo) return

          const cached = cache.readQuery<TodosQuery>({ query: GET_TODOS })
          const existingTodos = cached?.todos ?? []
          const withoutDuplicate = existingTodos.filter((todo) => todo.id !== addedTodo.id)

          cache.writeQuery<TodosQuery>({
            query: GET_TODOS,
            data: { todos: sortNewestFirst([addedTodo, ...withoutDuplicate]) },
          })
        },
      })

      if (data?.insert_todos_one) {
        setTodos(
          todos.value.map((todo) =>
            todo.id === optimisticTodo.id ? (data.insert_todos_one as Todo) : todo,
          ),
        )
      }
    } catch (e) {
      setTodos(previousTodos)
      error.value = e instanceof Error ? e.message : 'Failed to add todo'
      throw e
    }
  }

  async function toggleTodo(todo: Todo) {
    const previousTodos = todos.value
    const nextDone = !todo.is_done

    setTodos(todos.value.map((item) => (item.id === todo.id ? { ...item, is_done: nextDone } : item)))

    try {
      await apolloClient.mutate<ToggleTodoMutation>({
        mutation: TOGGLE_TODO,
        variables: { id: todo.id, done: nextDone },
        optimisticResponse: {
          update_todos_by_pk: {
            __typename: 'todos',
            id: todo.id,
            is_done: nextDone,
          },
        },
        update(cache, { data }) {
          const updatedTodo = data?.update_todos_by_pk
          if (!updatedTodo) return

          const cached = cache.readQuery<TodosQuery>({ query: GET_TODOS })
          if (!cached) return

          cache.writeQuery<TodosQuery>({
            query: GET_TODOS,
            data: {
              todos: cached.todos.map((item) =>
                item.id === updatedTodo.id ? { ...item, is_done: updatedTodo.is_done } : item,
              ),
            },
          })
        },
      })
    } catch (e) {
      setTodos(previousTodos)
      error.value = e instanceof Error ? e.message : 'Failed to update todo'
      throw e
    }
  }

  async function deleteTodo(id: string) {
    const previousTodos = todos.value

    setTodos(todos.value.filter((todo) => todo.id !== id))

    try {
      await apolloClient.mutate<DeleteTodoMutation>({
        mutation: DELETE_TODO,
        variables: { id },
        optimisticResponse: {
          delete_todos_by_pk: { __typename: 'todos', id },
        },
        update(cache, { data }) {
          const deletedTodo = data?.delete_todos_by_pk
          if (!deletedTodo) return

          const cached = cache.readQuery<TodosQuery>({ query: GET_TODOS })
          if (!cached) return

          cache.writeQuery<TodosQuery>({
            query: GET_TODOS,
            data: { todos: cached.todos.filter((todo) => todo.id !== deletedTodo.id) },
          })
        },
      })
    } catch (e) {
      setTodos(previousTodos)
      error.value = e instanceof Error ? e.message : 'Failed to delete todo'
      throw e
    }
  }

  // Optional: realtime updates (subscription)
  function startRealtime() {
    const obs = apolloClient.subscribe<{ todos: Todo[] }>({
      query: TODOS_SUB,
    })

    const sub = obs.subscribe({
      next: ({ data }) => {
        if (data?.todos) setTodos(data.todos)
      },
      error: (e) => {
        // keep app running even if WS fails
        console.error('Subscription error', e)
      },
    })

    return () => sub.unsubscribe()
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    startRealtime,
  }
})
