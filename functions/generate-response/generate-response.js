import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const resumeContext = `
Lukas Kubiena
lukasmariakubiena@gmail.com www.linkedin.com/in/lukas-kubiena +43 681 10599780

Education
Languages: German - native
English - fluent, professional working proficiency (TOEFL ibT 119/120)

Aarhus University
2023-Now Cognitive Science, BA
Engaged in a comprehensive Cognitive Science program at Aarhus University, delving into a multidisciplinary curriculum encompassing linguistics, biology, anthropology, computational neuroscience and artificial intelligence. Acquiring practical skills in programming (R and Python), statistical modelling, and empirical research design, alongside gaining a nuanced understanding of human cognition and communication. The theoretical knowledge and methodological training, particularly from courses like "Introduction to Experimental Methods, Statistics, and Programming" are preparing me for real-world applications of cognitive science. Throughout the upcoming semesters, I anticipate deepening my expertise in Data Analysis and enriching my previously acquired knowledge in interaction design through applied cognitive science.

Albertus Magnus Private School
2008-2021 Secondary education school type with emphasis on science
Austrian high-school diploma: "Excellent Success". Graduated with 1.0 average in Mathematics, English, German and Descriptive Geometry. Pre-scientific thesis: "Autonomous driving with a special focus on the car manufacturer Tesla"

Work Experience
Dembrane Design Internship 
01.2024 - Now UI/UX Design, User Research 
Collaboratively turning requirements analysis and process diagrams into intuitive UX flows and functional UI patterns for one of the OpenAI democratic inputs into AI grant winners - Dembrane, building digital deliberation systems that turns thousands of challenging conversations into tools for AI alignment.

Concept Feature Designs
08.2022 - 08.2023 Wireframing, CAD-Design, UI/UX Case Studies
Benefited from ADPList mentor sessions with Takahiro Kawaguchi, Director of UX Design at Reddit, known for his contributions to Airbnb's Design System. Developed multiple high fidelity designs and prototypes, in order to acquire industry needed knowledge about wireframing, useability testing and project development. Case study concepts include a mixed reality notes taking software, daily tasks structuring application and online service booking tool amongst others.

Paramedic for St. Johns Accident Assistance
10.2021 - 05.2022 Social Service, professional medical training
Passed the official emergency paramedic exam with honors and spent eight months working in ambulance services like rescue missions as well as patient transfers. Operated in city wide vaccination- and covid test centers, in addition to working in a refugee daycare facility for ukrainian refugees.

Leading Student Representative
11.2020 - 05.2021 Leadership, Project Management
Initiated a unique school-wide tutoring system, quickly engaging 24 tutees in 48 weekly tuition hours across six subjects, benefiting 900+ students overall. Participation surged by 157% in a short span. Served as a key liaison between students and the SGA during the Covid pandemic, leading surveys on 163 upper-grade students' workload and well-being, with findings presented to school leaders. Introduced and championed a vertical greening system for classrooms to enhance sustainability and reduce the school's carbon footprint. Recognized by the principal with multiple awards for exemplary student representation.

Kwizda Agro GmbH
07.2018-08.2018 Engineering-Maintainance and Repair Internship
Worked as intern in the engineering and maintainance section of Kwizda Agro GmbH Leobendorf. Daily tasks included restoring complex pipe nozzles back to working order, as well as general repairs in storage facilities.

Technical skills: Figma, Python, R Studio, HTML & CSS, Autodesk Fusion 360, Pixelmator, Adobe-Suite, Javascript & basic R3f, MicroStation CAD Software
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