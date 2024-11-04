import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ListRenderItem,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { defaultStyles } from "@/constants/Styles";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import ListingItem from "./ListingItem";
import { AirbnbList } from "@/app/interfaces/airbnb_list";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { fetchData } from "../utils/fetchData";

interface Props {
  category: string;
}

const ListingsBottomSheet = ({ category }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AirbnbList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const snapPoints = ["8%", "100%"];
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetListRef = useRef<BottomSheetFlatListMethods>(null);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  // Fetch items when category changes or on initial load
  useEffect(() => {
    loadInitialItems();
    scrollToTop(false);
    bottomSheetRef.current?.expand();
  }, [category]);

  const loadInitialItems = useCallback(async () => {
    setIsLoading(true);
    const response = await fetchData(
      `http://127.0.0.1:8000/get_farmhouses?category=${category}&page=1&limit=20`,
      "GET"
    );
    if (response && response.farmhouses) {
      setData(response.farmhouses);
      setCurrentPage(1); // Reset to page 1
      setHasMoreData(response.farmhouses.length === 20); // Check if there's more data
    }
    setIsLoading(false);
  }, [category]);

  // When you a reloading or scroll all the way to the bottom
  const loadMoreData = useCallback(async () => {
    if (isLoading || !hasMoreData) return; // Avoid unnecessary requests

    setIsLoading(true);
    const nextPage = currentPage + 1;
    const response = await fetchData(
      `http://127.0.0.1:8000/get_farmhouses?category=${category}&page=${nextPage}&limit=20`,
      "GET"
    );
    if (response && response.farmhouses) {
      setData((prevData) => [...prevData, ...response.farmhouses]);
      setCurrentPage(nextPage);
      setHasMoreData(response.farmhouses.length === 20); // If less than 20, no more data
    }
    setIsLoading(false);
  }, [isLoading, currentPage, hasMoreData, category]);

  const RenderRow: ListRenderItem<AirbnbList> = ({ item }) => {
    return <ListingItem item={item} />;
  };

  const scrollToTop = (animated = true) => {
    if (bottomSheetListRef.current) {
      bottomSheetListRef.current?.scrollToOffset({
        offset: 0,
        animated: animated,
      });
      setShowScrollToTopButton(false);
    }
  };

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffset = event.nativeEvent.contentOffset.y;
      setShowScrollToTopButton(currentOffset > 900);
    },
    []
  );

  const showMap = () => {
    bottomSheetRef.current?.collapse();
  };

  return (
    <BottomSheet
      style={styles.sheetContainer}
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: Colors.grey }}
    >
      <View style={styles.listHeader}>
        <Text
          style={{
            textAlign: "center",
            fontFamily: "mon-sb",
            fontSize: 14,
            color: "#333",
          }}
        >
          {data?.length} Homes
        </Text>
      </View>
      <View style={[defaultStyles.container, { paddingHorizontal: 16 }]}>
        <BottomSheetFlatList
          ref={bottomSheetListRef}
          data={data}
          renderItem={RenderRow}
          keyExtractor={(item: AirbnbList) => `${item.id + item.host_id}`}
          windowSize={6}
          initialNumToRender={15}
          maxToRenderPerBatch={20}
          onEndReached={loadMoreData} // Fetch more data if available
          onEndReachedThreshold={0.5}
          onScrollEndDrag={handleScroll}
        />
      </View>
      <View style={styles.absoluteBtn}>
        <TouchableOpacity style={styles.btn} onPress={showMap}>
          <Text style={{ fontFamily: "mon-sb", fontSize: 14, color: "#fff" }}>
            Map
          </Text>
          <Ionicons name="map" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {showScrollToTopButton && (
        <TouchableOpacity
          onPress={() => scrollToTop()}
          style={styles.scrollTopBtn}
        >
          <Ionicons name="arrow-up" style={{ color: "white" }} size={24} />
        </TouchableOpacity>
      )}
    </BottomSheet>
  );
};

export default ListingsBottomSheet;

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: 18,
    paddingHorizontal: 12,
  },
  absoluteBtn: {
    position: "absolute",
    alignItems: "center",
    bottom: 30,
    width: "100%",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: Colors.dark,
    opacity: 0.8,
  },
  scrollTopBtn: {
    position: "absolute",
    bottom: 32,
    right: 23,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 26,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
  },
});
