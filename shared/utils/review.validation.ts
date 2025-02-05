import { body } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

// Middleware de validación para la creación de reviews
export const validateReview = [
  body('calificacion')
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe ser un número entre 1 y 5')
    .toInt(),

  body('comentario')
    .isString()
    .trim()
    .escape()
    .customSanitizer((value) => sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }))
    .isLength({ min: 5 })
    .withMessage('El comentario debe tener al menos 5 caracteres'),
];

// Middleware de validación para la edición de reviews
export const validateReviewUpdate = [
  body('calificacion')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe ser un número entre 1 y 5')
    .toInt(),

  body('comentario')
    .optional()
    .isString()
    .trim()
    .escape()
    .isLength({ min: 5 })
    .withMessage('El comentario debe tener al menos 5 caracteres'),
];
