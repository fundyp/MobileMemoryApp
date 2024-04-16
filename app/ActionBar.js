import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const ActionBar = ({ title, onMenuPress }) => {
  return (
    <View style={styles.actionBar}>
      <TouchableOpacity onPress={onMenuPress}>
        <Image
          source={require("../constants/Daco_752371.png")}
          style={styles.menuIcon}
        />
      </TouchableOpacity>
      <View style={styles.actionBarTextContainer}>
        <Text style={styles.actionBarText}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionBar: {
    backgroundColor: "#331E3E",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  menuIcon: {
    width: 16,
    height: 16,
    tintColor: "white",
  },
  actionBarTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  actionBarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ActionBar;