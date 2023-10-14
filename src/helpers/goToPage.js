import eventBus from '@/eventBus.js'

export default function goToPage (pageName, pageParams) {
  eventBus.$emit('goToPage', pageName, pageParams)
}
