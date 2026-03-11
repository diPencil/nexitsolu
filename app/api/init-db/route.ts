import { NextResponse } from "next/server"
import { execSync } from "child_process"

export async function GET() {
    try {
        // Try common paths for prisma binary
        const prismaPath = "./node_modules/.bin/prisma"
        const output = execSync(`${prismaPath} db push --accept-data-loss`, { encoding: "utf-8" })
        
        return NextResponse.json({ 
            success: true, 
            message: "Database initialized successfully via direct path! 🚀",
            output: output 
        })
    } catch (error: any) {
        return NextResponse.json({ 
            success: false, 
            message: "Failed to initialize database",
            error: error.message,
            stderr: error.stderr
        }, { status: 500 })
    }
}
