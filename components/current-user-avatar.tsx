'use client'

import { useCurrentUserImage } from '@/hooks/use-current-user-image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'

export const CurrentUserAvatar = () => {
  const profileImage = useCurrentUserImage()
  return (
    <Avatar>
      {profileImage && <AvatarImage src={profileImage} alt="User Avatar" />}
      <AvatarFallback>
        <Image src="https://avatar.iran.liara.run/public/boy" alt="Default Avatar" width={40} height={40} />
      </AvatarFallback>
    </Avatar>
  )
}
