
import { supabase } from './supabase'

export async function generateStoryContent(prompt: string): Promise<string> {
    try {
        const { data, error } = await supabase.functions.invoke('gemini', {
            body: { prompt },
        })

        if (error) {
            throw new Error(error.message)
        }

        return data.text
    } catch (error) {
        console.error('Error calling Gemini:', error)
        throw error
    }
}
