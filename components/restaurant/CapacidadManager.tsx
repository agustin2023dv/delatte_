import React, { useState } from "react";
import { View, Text, TextInput, FlatList, Button, Alert, StyleSheet } from "react-native";

// Interfaces para definir los tipos de datos
interface Mesa {
  cantidad: number;
  personasPorMesa: number;
}

interface MenuItem {
  nombre: string;
  descripcion: string;
  precio: number;
}

// Props para CapacidadManager
interface CapacidadManagerProps {
  capacidadMesas: Mesa[];
  setCapacidadMesas: (mesas: Mesa[]) => void;
}

// Componente para gestionar la capacidad de mesas
const CapacidadManager: React.FC<CapacidadManagerProps> = ({ capacidadMesas, setCapacidadMesas }) => {
  const [cantidad, setCantidad] = useState<string>("");
  const [personas, setPersonas] = useState<string>("");

  const agregarMesa = () => {
    if (!cantidad || !personas) {
      Alert.alert("Error", "Debe ingresar ambos valores.");
      return;
    }

    const nuevaMesa: Mesa = {
      cantidad: parseInt(cantidad),
      personasPorMesa: parseInt(personas),
    };

    setCapacidadMesas([...capacidadMesas, nuevaMesa]);
    setCantidad("");
    setPersonas("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🪑 Capacidad de Mesas</Text>

      <TextInput
        placeholder="Cantidad de Mesas"
        keyboardType="numeric"
        value={cantidad}
        onChangeText={setCantidad}
        style={styles.input}
      />

      <TextInput
        placeholder="Personas por Mesa"
        keyboardType="numeric"
        value={personas}
        onChangeText={setPersonas}
        style={styles.input}
      />

      <Button title="Agregar Mesa" onPress={agregarMesa} />

      <FlatList
        data={capacidadMesas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{`🪑 ${item.cantidad} mesas de ${item.personasPorMesa} personas`}</Text>
        )}
      />
    </View>
  );
};

// Props para MenuManager
interface MenuManagerProps {
  menus: MenuItem[];
  setMenus: (menus: MenuItem[]) => void;
}

// Componente para gestionar el menú
const MenuManager: React.FC<MenuManagerProps> = ({ menus, setMenus }) => {
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [precio, setPrecio] = useState<string>("");

  const agregarItem = () => {
    if (!nombre || !descripcion || !precio) {
      Alert.alert("Error", "Debe completar todos los campos.");
      return;
    }

    const nuevoItem: MenuItem = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
    };

    setMenus([...menus, nuevoItem]);
    setNombre("");
    setDescripcion("");
    setPrecio("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Menú</Text>

      <TextInput
        placeholder="Nombre del Plato"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />

      <TextInput
        placeholder="Precio"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
        style={styles.input}
      />

      <Button title="Agregar Plato" onPress={agregarItem} />

      <FlatList
        data={menus}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{`🍲 ${item.nombre}: ${item.descripcion} - $${item.precio.toFixed(2)}`}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 15 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 5,
  },
});

export { CapacidadManager, MenuManager };
