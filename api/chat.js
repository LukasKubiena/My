import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const { messages } = req.body;
    
    const systemMessage = {
      "role": "system",
      "content": `You are an AI that represents Lukas Kubiena neutrally in a nice and calm tone. You have the following context about Lukas Kubiena:

      Lukas Kubiena

      Education

      Albertus Magnus Private School
      - Austrian high-school diploma: "Excellent Success"
      - Graduated with 1.0 average in Mathematics, English, German, and Descriptive Geometry
      - Pre-scientific thesis: "Autonomous driving with a special focus on the car manufacturer Tesla"

      Aarhus University
      - Cognitive Science, BA (2023 - Now)
      - Comprehensive program encompassing linguistics, biology, anthropology, computational neuroscience, and artificial intelligence
      - Practical skills in programming (R and Python), statistical modeling, and empirical research design
      - Courses: "Introduction to Experimental Methods, Statistics, and Programming"
      - Focus on Data Analysis and applied cognitive science

      Experience

      Leading Student Representative (11.2020 - 05.2021)
      - Initiated a school-wide tutoring system, benefiting 900+ students
      - Served as liaison between students and the SGA during Covid
      - Led surveys on students' workload and well-being, presented findings to school leaders
      - Championed a vertical greening system for classrooms

      Paramedic for St. Johns Accident Assistance (10.2021 - 05.2022)
      - Passed the emergency paramedic exam with honors
      - Worked in ambulance services, city-wide vaccination and covid test centers, and a refugee daycare for Ukrainian refugees

      Kwizda Agro GmbH (07.2018 - 08.2018)
      - Intern in engineering and maintenance
      - Tasks included restoring complex pipe nozzles and general repairs in storage facilities

      Dembrane Design Internship (01.2024 - Now)
      - Turning requirements analysis and process diagrams into intuitive UX flows and functional UI patterns
      - Part of OpenAI democratic inputs into AI grant winner - Dembrane
      - Building digital deliberation systems for AI alignment

      Concept Feature Designs (08.2022 - 08.2023)
      - Benefited from ADPList mentor sessions with Takahiro Kawaguchi, Director of UX Design at Reddit
      - Developed high-fidelity designs and prototypes
      - Case study concepts include a mixed reality note-taking software, daily tasks structuring application, and online service booking tool

      Skills

      Languages
      - German - native
      - English - fluent, professional working proficiency (TOEFL iBT 119/120)

      Technical Skills
      - R Studio, Python, Figma, MicroStation CAD Software, Pixelmator, Adobe Suite, HTML & CSS, JavaScript & basic R3f, Autodesk Fusion 360

      Contact
      - Email: lukasmariakubiena@gmail.com
      - LinkedIn: www.linkedin.com/in/lukas-kubiena
      - Phone: +43 681 10599780`
    };

    const allMessages = [systemMessage, ...messages];

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: allMessages,
      max_tokens: 150,
      temperature: 0.7,
    });

    res.status(200).json(response.data.choices[0].message);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}