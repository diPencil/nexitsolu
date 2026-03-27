import { ProfileMobileNav } from "@/components/profile/profile-mobile-nav"

export default async function ProfileUsernameLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ username: string }>
}) {
    const { username } = await params
    return (
        <>
            {children}
            <ProfileMobileNav username={username} />
        </>
    )
}
