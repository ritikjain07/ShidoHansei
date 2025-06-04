import { getRandomInterviewCover } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/firebase/admin";

interface InterviewRequest {
  type: string;
  role: string;
  level: string;
  techstack: string;
  amount: number;
  userid: string;
}

interface Interview {
  role: string;
  level: string;
  techstack: string[];
  type: string;
  questions: string[];
  userId: string;
  coverImage: string;
  finalized: boolean;
  createdAt: string;
}

export async function GET() {
  return Response.json({ success: true, data: 'THANK YOU FOR USING VAPI' }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    // Extract request data
    const { type, role, level, techstack, amount, userid }: InterviewRequest = await request.json();
    
    // Validate required fields
    if (!type || !role || !level || !techstack || !amount || !userid) {
      return Response.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Generate interview questions
    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
      `,
    });

    // Parse the generated questions with error handling
    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(text);
      
      // Verify it's an array
      if (!Array.isArray(parsedQuestions)) {
        throw new Error('Generated content is not in the expected array format');
      }
    } catch (parseError) {
      console.error('Failed to parse generated content:', parseError);
      console.log('Raw content:', text);
      
      // Attempt to extract an array from the text if parsing failed
      const match = text.match(/\[(.*)\]/s);
      if (match) {
        try {
          parsedQuestions = JSON.parse(`[${match[1]}]`);
        } catch {
          return Response.json({ 
            success: false, 
            error: 'Failed to parse generated questions' 
          }, { status: 500 });
        }
      } else {
        return Response.json({ 
          success: false, 
          error: 'Invalid format from question generator' 
        }, { status: 500 });
      }
    }

    // Create interview document
    const interview: Interview = {
      role,
      level,
      techstack: techstack.split(',').map(tech => tech.trim()),
      type,
      questions: parsedQuestions,
      userId: userid,
      coverImage: getRandomInterviewCover(),
      finalized: true,
      createdAt: new Date().toISOString()
    };

    // Save to database
    const docRef = await db.collection("interviews").add(interview);
    
    // Return success with document ID included
    return Response.json({
      success: true, 
      data: {
        ...interview,
        id: docRef.id
      }
    }, { status: 200 });
    
  } catch (error: unknown) {
    console.error('Interview generation error:', error);
    
    // Type guard to safely access error properties
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your request.';
    
    return Response.json({
      success: false, 
      error: errorMessage
    }, { status: 500 });
  }
}