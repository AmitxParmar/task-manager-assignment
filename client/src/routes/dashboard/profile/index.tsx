import { createFileRoute } from '@tanstack/react-router'
import { ProfileForm } from '@/components/forms/profile-form'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/dashboard/profile/')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Settings</h3>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}
