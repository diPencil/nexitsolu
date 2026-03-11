import { NextResponse } from "next/server"
import { execSync } from "child_process"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const adminEmail = searchParams.get('email')
    const adminPass = searchParams.get('pass') || 'Admin@123'

    const logs: string[] = []
    
    try {
        logs.push("Starting database initialization...")
        
        // 1. Run migrations/push
        const prismaPath = "./node_modules/.bin/prisma"
        try {
            const output = execSync(`${prismaPath} db push --accept-data-loss`, { encoding: "utf-8" })
            logs.push("Prisma Push Success: " + output)
        } catch (e: any) {
            logs.push("Prisma Push Error: " + e.message)
            if (e.stderr) logs.push("Stderr: " + e.stderr)
        }

        // 2. Generate client just in case
        try {
            execSync(`${prismaPath} generate`, { encoding: "utf-8" })
            logs.push("Prisma Generate Success")
        } catch (e: any) {
            logs.push("Prisma Generate Error: " + e.message)
        }

        // 3. Create Admin if requested
        if (adminEmail) {
            logs.push(`Attempting to create/update admin: ${adminEmail}`)
            const hashedPassword = await bcrypt.hash(adminPass, 10)
            
            const user = await prisma.user.upsert({
                where: { email: adminEmail },
                update: { role: "ADMIN" },
                create: {
                    email: adminEmail,
                    name: "System Admin",
                    username: adminEmail.split('@')[0],
                    password: hashedPassword,
                    role: "ADMIN"
                }
            })
            logs.push(`Admin ${user.email} is now ready!`)
        }
        
        return NextResponse.json({ 
            success: true, 
            message: "Database initialization process completed",
            logs: logs
        })
    } catch (error: any) {
        return NextResponse.json({ 
            success: false, 
            message: "Initialization failed in a major way",
            error: error.message,
            logs: logs
        }, { status: 500 })
    }
}
