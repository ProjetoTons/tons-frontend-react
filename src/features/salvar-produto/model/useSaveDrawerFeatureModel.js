import { useState } from 'react'

export function useSaveDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [itemsSalvos, setItemsSalvos] = useState([])

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)

  return { isDrawerOpen, itemsSalvos, setItemsSalvos, openDrawer, closeDrawer }
}
