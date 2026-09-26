import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface SchoolLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  inverted?: boolean;
  alignCenter?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  inverted = false,
  alignCenter = false
}) => {
  const { colors } = useTheme();

  const iconDimensions = {
    sm: 34,
    md: 44,
    lg: 64,
    xl: 88
  };

  const titleSizes = {
    sm: { primary: 13, secondary: 10 },
    md: { primary: 15, secondary: 11 },
    lg: { primary: 19, secondary: 13 },
    xl: { primary: 24, secondary: 15 }
  };

  const dim = iconDimensions[size];
  const fonts = titleSizes[size];

  return (
    <View
      style={[
        styles.container,
        alignCenter ? styles.centerLayout : styles.rowLayout
      ]}
    >
      <View
        style={[
          styles.emblemContainer,
          {
            width: dim,
            height: dim,
            borderRadius: Math.round(dim * 0.22),
            shadowColor: '#1E3A8A'
          }
        ]}
      >
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: dim, height: dim, borderRadius: Math.round(dim * 0.22) }}
          resizeMode="cover"
        />
      </View>

      <View style={[styles.textCol, alignCenter && styles.centerTextCol]}>
        <View style={[styles.titleRow, alignCenter && styles.centerRow]}>
          <Text
            style={[
              styles.primaryWord,
              {
                fontSize: fonts.primary,
                color: inverted ? '#93C5FD' : '#1E40AF'
              }
            ]}
          >
            PARADISE
          </Text>
          <Text
            style={[
              styles.secondaryWord,
              {
                fontSize: fonts.primary,
                color: inverted ? '#FFFFFF' : '#1E293B'
              }
            ]}
          >
            PUBLIC SCHOOL
          </Text>
        </View>

        {showSubtitle && (
          <Text
            style={[
              styles.subtitle,
              {
                fontSize: fonts.secondary,
                color: inverted ? '#CBD5E1' : '#64748B'
              }
            ]}
            numberOfLines={1}
          >
            CBSE Affiliated (Nursery to Class 8) • Estd. 1994
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  rowLayout: {
    flexDirection: 'row',
    gap: 12,
  },
  centerLayout: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
  },
  emblemContainer: {
    backgroundColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    overflow: 'hidden',
  },
  textCol: {
    justifyContent: 'center',
  },
  centerTextCol: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  centerRow: {
    justifyContent: 'center',
  },
  primaryWord: {
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  secondaryWord: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 2,
    fontWeight: '500',
    letterSpacing: 0.2,
  }
});
