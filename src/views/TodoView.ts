import { computed, defineComponent, h, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTodoStore, type Todo } from '@/stores/todo.store'

export default defineComponent({
  name: 'TodoView',
  setup() {
    const store = useTodoStore()
    const { todos, loading, error } = storeToRefs(store)
    const title = ref('')
    const saving = ref(false)
    const actionError = ref<string | null>(null)
    const filter = ref<'all' | 'active' | 'done'>('all')

    const remainingCount = computed(() => todos.value.filter((todo) => !todo.is_done).length)
    const completedCount = computed(() => todos.value.length - remainingCount.value)
    const completedLabel = computed(() =>
      completedCount.value === 1 ? '1 task done' : `${completedCount.value} tasks done`,
    )
    const remainingLabel = computed(() =>
      remainingCount.value === 1 ? '1 task remaining' : `${remainingCount.value} tasks remaining`,
    )
    const filteredTodos = computed(() => {
      switch (filter.value) {
        case 'active':
          return todos.value.filter((todo) => !todo.is_done)

        case 'done':
          return todos.value.filter((todo) => todo.is_done)

        default:
          return todos.value
      }
    })
    const visibleError = computed(() => error.value ?? actionError.value)

    let stopRealtime: (() => void) | undefined

    onMounted(() => {
      void store.fetchTodos()
      stopRealtime = store.startRealtime()
    })

    onUnmounted(() => {
      stopRealtime?.()
    })

    async function addTodo() {
      const cleanTitle = title.value.trim()
      if (!cleanTitle || saving.value) return

      saving.value = true
      actionError.value = null

      try {
        await store.addTodo(cleanTitle)
        title.value = ''
      } catch (e) {
        actionError.value = e instanceof Error ? e.message : 'Failed to add todo'
      } finally {
        saving.value = false
      }
    }

    async function toggleTodo(todo: Todo) {
      actionError.value = null

      try {
        await store.toggleTodo(todo)
      } catch (e) {
        actionError.value = e instanceof Error ? e.message : 'Failed to update todo'
      }
    }

    async function deleteTodo(id: string) {
      actionError.value = null

      try {
        await store.deleteTodo(id)
      } catch (e) {
        actionError.value = e instanceof Error ? e.message : 'Failed to delete todo'
      }
    }

    function renderTodo(todo: Todo) {
      return h('li', { key: todo.id, class: ['todo-item', todo.is_done && 'is-done'] }, [
        h('label', { class: 'todo-check' }, [
          h('input', {
            type: 'checkbox',
            checked: todo.is_done,
            onChange: () => void toggleTodo(todo),
          }),
          h('span', { class: 'todo-title' }, todo.title),
        ]),
        h(
          'button',
          {
            class: 'delete-button',
            type: 'button',
            onClick: () => void deleteTodo(todo.id),
          },
          'Delete',
        ),
      ])
    }

    return () =>
      h('main', { class: 'todo-view' }, [
        h('section', { class: 'todo-panel' }, [
          h('header', { class: 'todo-header' }, [
            h('div', [h('p', { class: 'eyebrow' }, 'Hasura Todos'), h('h1', 'Todo App')]),
            h('div', { class: 'todo-stats' }, [
              h('span', `${remainingCount.value} open`),
              h('span', `${completedCount.value} done`),
            ]),
          ]),

          h(
            'form',
            {
              class: 'todo-form',
              onSubmit: (event: SubmitEvent) => {
                event.preventDefault()
                void addTodo()
              },
            },
            [
              h('input', {
                value: title.value,
                placeholder: 'Enter todo',
                disabled: saving.value,
                onInput: (event: Event) => {
                  title.value = (event.target as HTMLInputElement).value
                },
              }),
              h(
                'button',
                {
                  type: 'submit',
                  disabled: saving.value || !title.value.trim(),
                },
                saving.value ? 'Adding...' : 'Add',
              ),
            ],
          ),
          h('div', { class: 'todo-filters' }, [
            h(
              'button',
              {
                type: 'button',
                class: filter.value === 'all' ? 'active' : '',
                onClick: () => (filter.value = 'all'),
              },
              'All',
            ),

            h(
              'button',
              {
                type: 'button',
                class: filter.value === 'active' ? 'active' : '',
                onClick: () => (filter.value = 'active'),
              },
              'Active',
            ),

            h(
              'button',
              {
                type: 'button',
                class: filter.value === 'done' ? 'active' : '',
                onClick: () => (filter.value = 'done'),
              },
              'Completed',
            ),
          ]),

          h('div', { class: 'todo-summary' }, [
            h('p', { class: 'todo-remaining' }, remainingLabel.value),
            h('p', { class: 'todo-completed' }, completedLabel.value),
          ]),

          visibleError.value ? h('p', { class: 'todo-error' }, visibleError.value) : null,

          loading.value && filteredTodos.value.length === 0
            ? h('p', { class: 'todo-empty' }, 'Loading todos...')
            : filteredTodos.value.length > 0
              ? h('ul', { class: 'todo-list' }, filteredTodos.value.map(renderTodo))
              : h('p', { class: 'todo-empty' }, 'No todos yet. Add the first one above.'),
        ]),
      ])
  },
})
