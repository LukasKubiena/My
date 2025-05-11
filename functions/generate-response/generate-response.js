import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const resumeContext = `
Lukas Kubiena
lukasmariakubiena@gmail.com www.linkedin.com/in/lukas-kubiena +45 93 88 45 98

Education
Aarhus University, Denmark
2023 - Now Cognitive Science, BSc.
Multidisciplinary degree in linguistics, biology, anthropology, neuroscience, and AI with 3.9 GPA. Skilled in R and Python for data science, specialising in Multilevel Statistical Modelling and Machine Learning for MEG & FMRI data. Completed intensive "Introduction to NLP and Generative AI" summer course.

Albertus Magnus Private School
2008 - 2021 Secondary education school type with emphasis on science
Austrian high-school diploma: "Excellent Success". Graduated with 1.0 GPA in Mathematics, English, German and Descriptive Geometry. Pre-scientific thesis: "Autonomous driving with a special focus on the car manufacturer Tesla"

Work Experience
Dembrane
11.2024 - Now Research & Impact Lead
Now Research & Impact Lead, managing relations with academic institutions, politicians and researchers. Contributed research insights to the company's open source transition, making our AI-powered ECHO platform publicly available under AGPL v3 license. Developed comprehensive impact measurement framework. Collaborated with OECD, EU Commission, and civic tech partners to establish Dembrane as the trusted AI solution for public participation, now used by 60+ government and institutional clients across Europe.

Dembrane
07.2024 - 11.2024 Design Researcher
Lead internal audit evaluating AI-powered platform's societal impact, delivering executive-level findings that reshaped product roadmap and organisational vision to ensure measurable impact in the citizen participation sector.

Dembrane
01.2024 - 07.2024 UI/UX & Information Design Internship
Designed core elements of Dembrane's AI-driven participation platform that scaled to 20+ clients across government and private sectors in six months. Incorporated findings from OpenAI's "Democratic Inputs to AI" grant research. Created intuitive UX flows that facilitated 450+ stakeholder conversations and positioned the company for 5x client growth. Contributed to product development securing European Horizon funding as part of a €3M EU research consortium, building AI-powered democratic participation tools.

Student assistant at the Interacting Minds Center Aarhus (IMC)
02.2024 - 01.2025 Front-end development, Research, Educational Workshops
Developed "The Never Ending Story," an AI-powered installation that engaged 400+ citizens across Denmark in understanding AI's societal impact. Collaborated with 36 researchers from multiple disciplines to create an educational platform allowing participants to experiment with AI-generated text and images. Presented at seven national workshops in partnership with cultural institutions, culminating in a major exhibition at Science Museerne.

Paramedic for St. Johns Accident Assistance
10.2021 - 05.2022 Social Service, professional medical training
Certified emergency paramedic with honors. Eight months in ambulance services, including rescue missions and patient transfers. Worked in pandemic support centres and Ukrainian refugee daycare facility.

Leading Student Representative
11.2020 - 05.2021 Leadership, Project Management
Led school-wide tutoring system with 24 tutors, 48 weekly hours, 6 subjects, benefiting 900+ students. As SGA liaison, surveyed 163 students on Covid-related issues. Introduced classroom greening. Received multiple awards for student representation.

Languages: 
German - native
English - fluent, professional working proficiency (TOEFL ibT 119/120)

Technical skills:
Figma
Python
R Studio
HTML & CSS
Autodesk Fusion 360
Pixelmator, Adobe-Suite
Javascript & basic R3f
MicroStation CAD Software
`;

const systemPrompt = `
You are an AI assistant designed to provide information about Lukas Kubiena based on his resume. 
Respond in a neutral, calm, and simple tone. Stick to factual information from the resume. Keep answers concise and nice, while making sure to not use any special symbols. Natural language formatting only. No markdown.
If asked about topics not related to Lukas or his qualifications, politely explain that you can only 
provide information about Lukas Kubiena's background and experience.
`;

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { userInput } = JSON.parse(event.body);

    console.log('Sending request to OpenAI...');
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using a valid OpenAI model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: `Resume context: ${resumeContext}` },
        { role: "user", content: userInput }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    console.log('Received response from OpenAI');

    return {
      statusCode: 200,
      body: JSON.stringify({ response: response.choices[0].message.content.trim() }),
    };
  } catch (error) {
    console.error('Error details:', error);
    if (error.response?.status === 429) {
      return {
        statusCode: 429,
        body: JSON.stringify({ 
          error: "The AI assistant is currently unavailable due to high demand. Please try again later.",
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "An error occurred while processing your request.",
        details: error.message,
      }),
    };
  }
};