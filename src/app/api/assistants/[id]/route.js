import { NextResponse } from 'next/server';
import connectDB from '@/lib/connection';
import Assistant from '@/models/Assistant';

export const GET = async (req) => {
    try {
        const id = req.url.split('api/assistants/')[1].split('/')[0];
        await connectDB();
        const assistant = await Assistant.findOne({ assistantId: id});
        if (assistant === null) {
            return NextResponse.json({
                "status": "error",
                "error": "Assistant not found"
    
            }, { status: 500 });
        }
        return NextResponse.json(assistant);
    } catch (error) {
        return NextResponse.json({
            "status": "error",
            "error": error.message

        }, { status: 500 });
    }
}

export const PATCH = async (req) => {
    try {
        let bodyText = '';
        for await (const chunk of req.body) {
            bodyText += chunk;
        }
        console.log(bodyText);
        const id = req.url.split('api/assistants/')[1].split('/')[0];
        await connectDB();
        const updatedAssistant = await Assistant.findOneAndUpdate({ assistantId: id}, JSON.parse(bodyText));
        if (updatedAssistant === null) {
            return NextResponse.json({
                "status": "error",
                "error": "Assistant not found"
    
            }, { status: 500 });
        }
        return NextResponse.json(updatedAssistant);
    } catch (error) {
        return NextResponse.json({
            "status": "error",
            "error": error.message

        }, { status: 500 });
    }
}