import { Request, Response } from 'express';
import {
  addPhotoToGalleryService,
  checkUserRoleInRestaurantService,
  getAllRestaurantsService,
  getGalleryPhotosService,
  getRestaurantDetailsService,
  getRestaurantsByManagerIdService,
  registerRestaurantService,
  removePhotoFromGalleryService,
  updateRestaurantService
} from '../services/restaurant.service';
import { registerManagerService } from '../services/user.service';
import { hashPasswordService } from '../services/auth.service';
import { getPlacesNearbyService, getRestaurantByNameService } from '../services/search.service';
import { AuthRequest } from '@/types';

//* Controlador para crear un nuevo restaurante y manager
export const registerRestaurantAndManagerController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log("Datos recibidos en el controlador:", req.body);

    const { restaurant: restaurantData, manager: managerData } = req.body;

    // Hashear la contraseña del usuario
    const hashedPassword = await hashPasswordService(managerData.password);
    managerData.password = hashedPassword;

    console.log("Restaurant details: ", restaurantData);
    console.log("Manager: ", managerData);

    // Guardar el manager
    const savedManager = await registerManagerService(managerData);

    // Asociar el manager principal al restaurante
    restaurantData.managerPrincipal = savedManager._id;

    // Guardar el restaurante
    const savedRestaurant = await registerRestaurantService(restaurantData);

    res.status(201).json({ savedRestaurant, savedManager });
  } catch (error) {
    console.error("Error en el controlador:", error);
    res.status(500).json({
      message: "Error al registrar el restaurante y manager",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

//* Controlador para obtener TODOS los restaurantes
export const getAllRestaurantsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurants = await getAllRestaurantsService();

    if (!restaurants || restaurants.length === 0) {
      res.status(404).json({ message: "No se encontraron restaurantes" });
      return;
    }

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener restaurantes", error });
  }
};

//* Controlador para obtener los detalles de un restaurante

export const getRestaurantByIdController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurant = await getRestaurantDetailsService(req.params.id);

    if (!restaurant) {
      res.status(404).json({ message: "Restaurante no encontrado" });
      return;
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el restaurante", error });
  }
};

//* Controlador para actualizar un restaurante
export const updateRestaurantController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updatedRestaurant = await updateRestaurantService(req.params.id, req.body);

    if (!updatedRestaurant) {
      res.status(404).json({ message: "Restaurante no encontrado" });
      return;
    }

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el restaurante", error });
  }
};

//*Controlador para obtener restaurantes a cargo de un manager
export const getRestaurantsByManagerIdController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurants = await getRestaurantsByManagerIdService(req.params.id);

    if (!restaurants) {
      res.status(404).json({ message: "No se encontraron restaurantes para este manager" });
      return;
    }

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los restaurantes", error });
  }
};

export const checkManagerRoleController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const { restaurantId } = req.params;
    const userId = req.user.id;
    const isManager = await checkUserRoleInRestaurantService(restaurantId, userId);

    res.status(200).json({ isManager });
  } catch (error) {
    console.error("Error verificando rol:", error);

    if (error === "Restaurante no encontrado") {
      res.status(404).json({ message: error });
      return;
    }

    res.status(500).json({ message: "Error interno del servidor" });
  }
};




export const getSearchResultsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;

    if (!query) {
      res.status(400).json({ message: "Parámetro de búsqueda no válido" });
      return;
    }

    const results = await getRestaurantByNameService(query);
    res.json(results);
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    res.status(500).json({ message: "Error en la búsqueda", error });
  }
};


// Obtener las fotos de la galería de un restaurante
export const getGalleryPhotosController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: restaurantId } = req.params;
    const photos = await getGalleryPhotosService(restaurantId);

    res.status(200).json({ success: true, photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

// Agregar una foto a la galería de un restaurante
export const addPhotoToGalleryController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: restaurantId } = req.params;

    if (!req.file) {
      res.status(400).json({ success: false, message: "No se subió ninguna foto" });
      return;
    }

    const photoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const updatedGallery = await addPhotoToGalleryService(restaurantId, photoUrl);

    res.status(200).json({ success: true, gallery: updatedGallery });
  } catch (error) {
    console.error("Error al agregar la foto:", error);
    res.status(500).json({ success: false, message: "Error al agregar la foto a la galería" });
  }
};

// Eliminar una foto de la galería de un restaurante
export const removePhotoFromGalleryController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: restaurantId } = req.params;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      res.status(400).json({ success: false, message: "URL de la foto es requerida" });
      return;
    }

    const updatedGallery = await removePhotoFromGalleryService(restaurantId, photoUrl);
    res.status(200).json({ success: true, gallery: updatedGallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const getNearbyRestaurantsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng || !radius) {
      res.status(400).json({ message: "Faltan parámetros obligatorios (lat, lng, radius)." });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const searchRadius = parseInt(radius as string);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
      res.status(400).json({ message: "Los parámetros (lat, lng, radius) deben ser números válidos." });
      return;
    }

    const nearbyRestaurants = await getPlacesNearbyService(latitude, longitude, searchRadius);

    res.status(200).json(nearbyRestaurants.length ? nearbyRestaurants : { message: "No se encontraron restaurantes cercanos." });
  } catch (error) {
    res.status(500).json({ message: "Error al buscar restaurantes cercanos", error });
  }
};

