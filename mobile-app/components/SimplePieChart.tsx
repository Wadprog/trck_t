import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

const SimplePieChart = ({ data }: { data: Array<{name: string, amount: number, color: string, icon: string, shortName: string}> }) => {
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const radius = 70; // Reduced from 90
  const strokeWidth = 45; // Reduced from 60
  const center = 90; // Reduced from 110
  const circumference = 2 * Math.PI * radius;
  
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const totalTransactions = data.length;
  
  let cumulativePercentage = 0;
  
  const handleSegmentPress = (index: number) => {
    setSelectedSegment(selectedSegment === index ? null : index);
  };
  
  // Calculate label position for each segment
  const getLabelPosition = (startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius + 30; // Position labels outside the chart
    const x = center + labelRadius * Math.cos(midAngle);
    const y = center + labelRadius * Math.sin(midAngle);
    return { x, y };
  };
  
  return (
    <View style={styles.pieChartContainer}>
      <Svg height="200" width="200" viewBox="0 0 200 200">
        <G>
          {data.map((item, index) => {
            const percentage = (item.amount / total) * 100;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
            const isSelected = selectedSegment === index;
            const segmentRadius = isSelected ? radius + 10 : radius;
            const segmentStrokeWidth = isSelected ? strokeWidth + 10 : strokeWidth;
            const segmentCenter = isSelected ? center + 5 : center;
            
            // Calculate angles for label positioning
            const startAngle = (cumulativePercentage / 100) * 2 * Math.PI - Math.PI / 2;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 2 * Math.PI - Math.PI / 2;
            const labelPos = getLabelPosition(startAngle, endAngle);
            
            cumulativePercentage += percentage;
            
            return (
              <G key={index}>
                <Circle
                  cx={segmentCenter}
                  cy={segmentCenter}
                  r={segmentRadius}
                  stroke={item.color}
                  strokeWidth={segmentStrokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  transform={`rotate(-90 ${segmentCenter} ${segmentCenter})`}
                  opacity={isSelected ? 0.9 : 1}
                  onPress={() => handleSegmentPress(index)}
                />
                
                {/* Label for percentage and category */}
                {percentage > 5 && ( // Only show labels for segments > 5%
                  <G>
                    <SvgText
                      x={labelPos.x}
                      y={labelPos.y - 8}
                      fontSize="14"
                      textAnchor="middle"
                    >
                      {item.icon}
                    </SvgText>
                    <SvgText
                      x={labelPos.x}
                      y={labelPos.y + 5}
                      fontSize="11"
                      fontWeight="600"
                      fill="#333"
                      textAnchor="middle"
                    >
                      {item.shortName}
                    </SvgText>
                    <SvgText
                      x={labelPos.x}
                      y={labelPos.y + 18}
                      fontSize="10"
                      fill="#666"
                      textAnchor="middle"
                    >
                      {percentage.toFixed(1)}%
                    </SvgText>
                  </G>
                )}
              </G>
            );
          })}
        </G>
      </Svg>
      
      {/* Display center info */}
      <View style={styles.centerInfo}>
        {selectedSegment !== null ? (
          <>
            <Text style={styles.selectedCategoryIcon}>{data[selectedSegment].icon}</Text>
            <Text style={styles.selectedCategory}>{data[selectedSegment].name}</Text>
            <Text style={styles.selectedAmount}>${data[selectedSegment].amount.toFixed(2)}</Text>
          </>
        ) : (
          <>
            <Text style={styles.transactionCount}>{totalTransactions}</Text>
            <Text style={styles.transactionLabel}>Transactions</Text>
            <Text style={styles.totalAmountCenter}>${total.toFixed(0)}</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default SimplePieChart;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  topSection: {
    maxHeight: '60%', // Limits the top section to 60% of screen height
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  date: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 15,
  },
  dateRangeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  calendarIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  dateRangeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  datePickerContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  datePickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  datePickerOptions: {
    padding: 8,
  },
  dateOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginVertical: 2,
  },
  dateOptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  customDateOption: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
    paddingTop: 12,
  },
  customDatePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  customDatePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    maxWidth: 350,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  customDatePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  dateInputContainer: {
    marginBottom: 15,
  },
  dateInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateInputText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  quickDateAdjustments: {
    marginTop: 10,
    marginBottom: 20,
  },
  quickDateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  quickDateButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickDateButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickDateButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  customDatePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  customDatePickerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    backgroundColor: '#007AFF',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  categoryListContainer: {
    marginTop: 5,
  },
  categoryListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryListIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  categoryListName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  categoryListRight: {
    alignItems: 'flex-end',
  },
  categoryListAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
  categoryListPercentage: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  pieChartContainer: {
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 5,
    position: 'relative',
  },
  centerInfo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -25 }],
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 70,
  },
  transactionCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 1,
  },
  totalAmountCenter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
    marginTop: 2,
  },
  selectedInfo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -20 }],
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCategoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  selectedCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 2,
  },
  listContainer: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingVertical: 10,
  },
  transactionsContainer: {
    flex: 1,
    minHeight: 200, // Ensures minimum height for transactions
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transactionSeparator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  // Transaction Detail Styles
  transactionDetailContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  transactionDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  transactionDetailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 32,
  },
  transactionDetailContent: {
    flex: 1,
    padding: 20,
  },
  transactionDetailSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryNameDetail: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  transactionAmountDetail: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  transactionDescriptionDetail: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
  },
  transactionDateDetail: {
    fontSize: 16,
    color: '#333',
  },
  transactionIdDetail: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'monospace',
  },
  transactionActions: {
    marginTop: 20,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
