import { Client } from '@notionhq/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig(event)

  if (!body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required',
    })
  }

  const notion = new Client({
    auth: config.NOTION_SECRET,
  })

  try {
    const response = await notion.pages.create({
      parent: {
        database_id: config.NOTION_DATABASE_ID as string,
      },
      properties: {
        Email: {
          type: 'email',
          email: body.email,
        },
      },
    })

    if (!response.id) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create page',
      })
    }

    return {
      message: 'Email added successfully',
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to add email',
    })
  }
})