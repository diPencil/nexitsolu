import { NextResponse } from "next/server"
import { execSync } from "child_process"

export async function GET() {
    try {
        // This command will run prisma db push on the server
        const output = execSync("npx prisma db push --accept-data-loss", { encoding: "utf-8" })
        
        return NextResponse.json({ 
            success: true, 
            message: "Database initialized successfully! 🚀",
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
