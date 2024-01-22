import { NextResponse } from 'next/server';
import Assistant from '@/models/Assistant';
import connectDB from '@/lib/connection';

export const GET = async () => {
    await connectDB();
    const assistant = await Assistant.find();
    return NextResponse.json(assistant);
}

export const POST = async ({ body }) => {
    try {
        let bodyText = '';
        for await (const chunk of body) {
            bodyText += chunk;
        }
        console.log(bodyText);
        const { assistantId, assistantName, assistantPhone } = JSON.parse(bodyText);
        // if (!assistantId || !assistantName || !assistantPhone) {
        //     return NextResponse.json({
        //         "status": "error",
        //         "error": "Please provide all fields"
        //     }, { status: 400 })
        // }
        await connectDB();
        const assistant = new Assistant({
            assistantId,
            assistantName,
            assistantPhone,
            assistantAssistance: false
        });
        await assistant.save();
        return NextResponse.json({
            "status": "success",
            "message": "Assistant created successfully",
            assistant
        }, { status: 201 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            "status": "error",
            "error": error.message
        }, { status: 500 })
    }
}