import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Share,
  TouchableOpacity
} from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, useAnimatedScrollHandler, SlideInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { AirbnbList } from '@/app/interfaces/airbnb_list';
import { fetchData } from '../../utils/fetchData';  // Assuming fetchData handles API requests
import { DatePickerModal } from 'react-native-paper-dates';
import { Provider as PaperProvider, DefaultTheme} from 'react-native-paper';

const IMG_HEIGHT = 300;
const { width } = Dimensions.get('window');

const Page = () => {
  const today = new Date().toISOString().substring(0, 10);
  const { id } = useLocalSearchParams<{ id: string }>();  // Get the ID from params
  const navigation = useNavigation();
  const [item, setItem] = useState<AirbnbList | null>(null);  // Store the fetched item
  const [imageLoading, setImageLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  // Shared value for scroll offset
  const scrollY = useSharedValue(0);

  // Scroll handler for tracking scroll offset
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const [visible, setVisible] = useState(false);
  const [range, setRange] = useState<{ startDate: Date | undefined; endDate: Date | undefined }>({
    startDate: undefined,
    endDate: undefined,
  });

  // Fetch the item from the backend when the component starts to load
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        console.log(id)
        const response = await fetchData(`http://127.0.0.1:8000/get_farmhouse/${id}`, 'GET');
        if (response) {
          console.log(response)
          setItem(response);  // Set the item fetched from the backend
        }
      } catch (err) {
        console.log('Error fetching item:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();  // Fetch only if id exists
    }
    
  }, [id]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Animated.View style={[headerAnimatedStyle, styles.header]} />
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundBtn} onPress={shareListing}>
            <Ionicons name="share-outline" size={22} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundBtn}>
            <Ionicons name="heart-outline" size={22} color={"#000"} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.roundBtn} onPress={navigation.goBack}>
          <Ionicons name="chevron-back" size={24} color={"#000"} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, shareListing, headerAnimatedStyle]);
  





  const shareListing = async () => {
    if (!item) return;
    try {
      await Share.share({
        title: item?.name,
        url: item?.listing_url ?? '',
      });
    } catch (err) {
      console.log('Share Error: ', err);
    }
  };
  const onDismiss = () => {
    setVisible(false);
  };
  const onConfirm = ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
    setVisible(false);
    setRange({ startDate, endDate });
    // Handle the selected date range here
    console.log('Selected date range:', startDate, endDate);
    // You can navigate to a booking confirmation screen or update the UI accordingly
  };

  // Animated style for the image
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(scrollY.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]),
        },
        {
          scale: interpolate(scrollY.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, IMG_HEIGHT / 4], [0, 1]),
    };
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text>Loading farmhouse details...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text>Farmhouse not found.</Text>
      </View>
    );
  }

  return (
  <PaperProvider theme={theme} >
    <View style={styles.container}>
      <Animated.ScrollView
        onScroll={scrollHandler}  // Using the scroll handler
        scrollEventThrottle={16}  // Smooth scrolling
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.imageLoader}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text>Loading image...</Text>
            </View>
          )}
          <Animated.Image
            source={{ uri: item.picture_url }}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            style={[styles.image, imageAnimatedStyle]}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item?.name}</Text>
          <Text style={styles.location}>
            {item?.room_type} in {item?.host_location}
          </Text>
          <View style={styles.rooms}>
            <Text style={styles.roomsText}>{item?.bedrooms} bedrooms</Text>
            <Text style={styles.dividerText}>|</Text>
            <Text style={styles.roomsText}>{item?.beds} beds</Text>
            <Text style={styles.dividerText}>|</Text>
            <Text style={styles.roomsText}>{item?.bathrooms} bathrooms</Text>
          </View>
          <View style={styles.ratingsContainer}>
            <Ionicons name="star" size={16} />
            <Text style={styles.ratings}>
              {item?.review_scores_rating} . {item?.number_of_reviews} reviews
            </Text>
          </View>
        </View>

        <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(300)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 8,
            }}
          >
            <View style={styles.footerText}>
              <Text style={styles.footerPrice}>{item?.price ? item.price : 'Price: N/A'}</Text>
              {item?.price && <Text style={{ fontSize: 16 }}>night</Text>}
            </View>
            <TouchableOpacity
              style={[defaultStyles.btn, { paddingHorizontal: 24, height: 48 }]}
              onPress={() => setVisible(true)}
            >
              <Text style={defaultStyles.btnText}>Reserve</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        

        
  
      </Animated.ScrollView>
    </View>
    <DatePickerModal
          locale="en"
          mode="range"
          rangeColors = {Colors.primary}
          color = {Colors.primary}
          visible={visible}
          onDismiss={onDismiss}
          startDate={range.startDate}
          endDate={range.endDate}
          onConfirm={onConfirm}
          validRange={{
            startDate: new Date(), // Optional, sets the minimum selectable date
          }}
          animationType="slide" // Optional, can be 'slide' or 'fade'
         
        />
        
  </PaperProvider>
  );
};

export default Page;

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, // This ensures the other necessary colors are retained
    primary: Colors.primary, // Override only the primary color
    // You can override other colors if needed
  },
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  roundBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 38,
    height: 38,
    marginBottom: 6,
    borderRadius: 50,
    backgroundColor: "white",
    color: Colors.primary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },
  header: {
    backgroundColor: "#fff",
    height: "100%",
    borderBottomColor: Colors.dark,
    borderWidth: StyleSheet.hairlineWidth,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: IMG_HEIGHT,
    width,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageLoader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
  },
  infoContainer: {
    padding: 24,
    backgroundColor: 'white',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'mon-sb',
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'mon-sb',
  },
  rooms: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  roomsText: {
    fontSize: 16,
    color: Colors.grey,
    fontFamily: 'mon',
  },
  dividerText: {
    fontSize: 16,
    fontFamily: 'mon',
    color: 'lightgrey',
  },
  ratingsContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  ratings: {
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hostImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostName: {
    fontWeight: '500',
    fontSize: 16,
  },
  hostSince: {
    fontSize: 14,
    color: Colors.grey,
  },
  footerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    height: '100%',
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: 'mon-sb',
  },
});

