import { Icon } from '@/components/ui/Icon'

export function VideoOverlay() {
  return (
    <div className="absolute inset-0 flex cursor-pointer items-center justify-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50">
        <Icon name="play" size={24} className="text-white" />
      </div>
    </div>
  )
}
