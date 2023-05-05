import * as dotenv from 'dotenv';
dotenv.config();

import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const messages = [
  {
    role: 'system',
    content: `
        You will act as a professional chef and will be given a list of ingredients. 
        Your responsibility is to provide a few options for meals that can be made using those ingredients. 
        You may suggest meals that include ingredients that were not listed. 
        Do not include the procedures in the meal's description. 
        An example of the meal's description would be: 
            'A refreshing and healthy salad that combines tender chicken, crispy greens, and tangy dressing.' 
            or 'A hearty comfort food made with tender beef and sliced potatoes layered with a rice sauce and baked to perfection.'. 
    `,
  },
];

const recipeIdeas = async (req, res) => {
  const { ingredients } = req.body;
  console.log(ingredients);
  if (!ingredients)
    return res
      .status(404)
      .send({ error: 'Please provide a list of ingredients' });

  const newMessage = {
    role: 'user',
    content: `ingredients: ${ingredients}. 
        Return response in the following parsable JSON format: { options: [ {name: [meal name], description: [meal description]},...]}`,
  };
  messages.push(newMessage);
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });
    console.log(completion.data.useage);
    const response = JSON.parse(completion.data.choices[0].message.content);
    console.log({ success: true, response });
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
};

const generateRecipe = async (req, res) => {
  const { name, description } = req.body;
  console.log(`${name}:${description}`);
  if (!name || !description)
    return res.status(400).send({ error: 'Input variables not provided.' });

  messages.push({
    role: 'user',
    content: `Provide the full, detailed recipe for the meal:
      ${name} : ${description}.
      Return response in the following parsable JSON format: {
        name: ,
        description: ,
        prep_time: ,
        cook_time: ,
        ingredients: ['', ...}],
        procedures: ['', ...]
      }
    `,
  });
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });
    console.log(completion.data.useage);
    const response = JSON.parse(completion.data.choices[0].message.content);
    console.log(response);
    res.send({ success: true, recipe: response });
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
};

export { recipeIdeas, generateRecipe };
