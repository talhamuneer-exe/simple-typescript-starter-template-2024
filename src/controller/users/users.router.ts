import express from 'express';
import { asyncWrapper } from '../../middleware';
import { UsersController } from './users.controller';

export const usersRouter = express.Router();

// GET /api/users - Get all users
usersRouter.get('/', asyncWrapper(UsersController.getUsers));

// GET /api/users/:id - Get user by ID
usersRouter.get('/:id', asyncWrapper(UsersController.getUserById));
