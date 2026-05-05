import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { MenuController } from './menu.controller'

export async function menuRoutes(app: FastifyInstance) {
  const controller = new MenuController()

  app.get('/', {
    schema: {
      tags: ['Menu'],
      description: 'Listar todas as categorias com itens disponíveis',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              slug: { type: 'string' },
              description: { type: 'string', nullable: true },
              order: { type: 'integer' },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    price: { type: 'string' },
                    image: { type: 'string', nullable: true },
                    available: { type: 'boolean' },
                    categoryId: { type: 'string', format: 'uuid' },
                  },
                },
              },
            },
          },
        },
      },
    },
  }, controller.getAllCategories)

  app.get('/category/:slug', {
    schema: {
      tags: ['Menu'],
      description: 'Listar itens de uma categoria',
      params: {
        type: 'object',
        properties: { slug: { type: 'string' } },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            items: { type: 'array' },
          },
        },
        404: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  }, controller.getItemsByCategory)

  app.get('/:slug', {
    schema: {
      tags: ['Menu'],
      description: 'Buscar item por slug',
      params: {
        type: 'object',
        properties: { slug: { type: 'string' } },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string', nullable: true },
            price: { type: 'string' },
            image: { type: 'string', nullable: true },
            available: { type: 'boolean' },
            categoryId: { type: 'string', format: 'uuid' },
          },
        },
        404: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  }, controller.getItemBySlug)
}
