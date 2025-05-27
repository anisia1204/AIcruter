import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    if (currentPage < 2) {
      return [0, 1, '...', totalPages - 1];
    }
    if (currentPage >= totalPages - 2) {
      return [0, '...', totalPages - 3, totalPages - 2, totalPages - 1];
    }
    return [0, '...', currentPage, '...', totalPages - 1];
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navButton, currentPage === 0 && styles.disabled]}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <Text style={styles.navText}>‹</Text>
      </TouchableOpacity>

      <View style={styles.pageNumbers}>
        {getPageNumbers().map((item, idx) => {
          if (item === '...') {
            return (
              <Text key={`ellipsis-${idx}`} style={styles.ellipsis}>...</Text>
            );
          }
          return (
            <TouchableOpacity
              key={item}
              onPress={() => onPageChange(item as number)}
              style={[
                styles.pageButton,
                item === currentPage && styles.pageButtonActive,
              ]}
            >
              <Text style={[styles.pageText, item === currentPage && styles.pageTextActive]}>
                {(item as number) + 1}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.navButton, currentPage >= totalPages - 1 && styles.disabled]}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >
        <Text style={styles.navText}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  navButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
  },
  navText: {
    fontSize: 18,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 10,
  },
  pageButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 2,
  },
  pageButtonActive: {
    backgroundColor: '#3F51B5',
  },
  pageText: {
    fontSize: 14,
    color: '#333',
  },
  pageTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  ellipsis: {
    fontSize: 16,
    color: '#888',
    marginHorizontal: 4,
  },
});

export default Pagination;
