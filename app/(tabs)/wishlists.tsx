import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Colors from "@/constants/Colors";

interface WishlistItem {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  isAvailable: boolean;
  category: 'FarmHouses' | 'Catering' | 'Others';
}

const WishlistCartPage: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    // Sample data, replace with your actual data
    {
      id: '1',
      title: 'Rustic Barn Retreat',
      image: 'https://a0.muscache.com/pictures/4378248/3e40ff9d_original.jpg',
      price: 150,
      rating: 4.7,
      isAvailable: true,
      category: 'FarmHouses',
    },
    {
      id: '2',
      title: 'Gourmet Farm-to-Table Dinner',
      image: 'https://a0.muscache.com/pictures/miso/Hosting-1391124/original/bf2541b8-74d7-4667-9f09-b031921a9143.png',
      price: 80,
      rating: 4.9,
      isAvailable: true,
      category: 'Catering',
    },
    {
      id: '3',
      title: 'Horseback Riding Experience',
      image: 'https://a0.muscache.com/pictures/airflow/Hosting-1395698/original/bc359ed6-7d77-4b67-8c33-9fe0c541f86d.jpg',
      price: 60,
      rating: 4.5,
      isAvailable: true,
      category: 'Others',
    },
    // Add more items...
  ]);

  const categories = ['FarmHouses', 'Catering', 'Others'];

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const deleteItem = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const renderWishlistItem = ({ item }: { item: WishlistItem }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.id)}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        <Text style={styles.itemRating}>★ {item.rating}</Text>
        {item.isAvailable ? (
          <Text style={styles.availableText}>Available</Text>
        ) : (
          <Text style={styles.unavailableText}>Unavailable</Text>
        )}
      </View>
      {/* <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity> */}
    </View>
  );

  const renderCategory = ({ item: category }: { item: string }) => {
    const categoryItems = wishlistItems.filter(item => item.category === category);
    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity onPress={() => toggleCategory(category)} style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <Text style={styles.expandIcon}>{expandedCategory === category ? '▼' : '▶'}</Text>
        </TouchableOpacity>
        {expandedCategory === category && (
          <FlatList
            data={categoryItems}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Wishlist</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.primary,
  },
  listContainer: {
    paddingBottom: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  expandIcon: {
    fontSize: 18,
    color: 'white',
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  itemDetails: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 4,
  },
  itemRating: {
    fontSize: 14,
    color: '#ffa41c',
    marginBottom: 4,
  },
  availableText: {
    color: 'green',
    fontWeight: 'bold',
  },
  unavailableText: {
    color: 'red',
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default WishlistCartPage;