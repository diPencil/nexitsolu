import { NextResponse } from "next/server"
import { spawnSync } from "child_process"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const adminEmail = searchParams.get('email')
    const adminPass = searchParams.get('pass') || 'Admin@123'

    const logs: string[] = []
    
    try {
        // تأكيد وجود فولدر prisma
        const prismaDir = path.join(process.cwd(), "prisma")
        if (!fs.existsSync(prismaDir)) {
            fs.mkdirSync(prismaDir, { recursive: true })
            logs.push("Created prisma directory")
        }

        logs.push("Starting database initialization...")
        
        // استخدام spawnSync مباشرة لتوفير الموارد
        const prismaPath = path.join(process.cwd(), "node_modules", ".bin", "prisma")
        
        try {
            const pushResult = spawnSync(prismaPath, ["db", "push", "--accept-data-loss"], { 
                encoding: "utf-8",
                env: { ...process.env, DATABASE_URL: `file:${path.join(prismaDir, "dev.db")}` }
            })
            logs.push("Push Status: " + pushResult.status)
            if (pushResult.stdout) logs.push("Output: " + pushResult.stdout.substring(0, 200))
        } catch (e: any) {
            logs.push("Push Error: " + e.message)
        }

        if (adminEmail) {
            logs.push(`Attempting to create admin: ${adminEmail}`)
            const hashedPassword = await bcrypt.hash(adminPass, 10)
            
            const user = await prisma.user.upsert({
                where: { email: adminEmail },
                update: { role: "ADMIN" },
                create: {
                    email: adminEmail,
                    name: "System Admin",
                    username: adminEmail.split('@')[0] + Math.floor(Math.random() * 100),
                    password: hashedPassword,
                    role: "ADMIN"
                }
            })
            logs.push(`Admin ${user.email} is READY!`)
        }
        
        return NextResponse.json({ success: true, logs })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, logs }, { status: 500 })
    }
}
