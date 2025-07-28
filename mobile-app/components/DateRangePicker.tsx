import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  onTodayPress: () => void;
  onLastWeekPress: () => void;
  onLastMonthPress: () => void;
  dateRangeText: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateRangeChange,
  onTodayPress,
  onLastWeekPress,
  onLastMonthPress,
  dateRangeText,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date>(endDate);

  const handleTodayPress = () => {
    onTodayPress();
    setShowDatePicker(false);
  };

  const handleLastWeekPress = () => {
    onLastWeekPress();
    setShowDatePicker(false);
  };

  const handleLastMonthPress = () => {
    onLastMonthPress();
    setShowDatePicker(false);
  };

  const applyCustomDateRange = () => {
    onDateRangeChange(tempStartDate, tempEndDate);
    setShowCustomDatePicker(false);
    setShowDatePicker(false);
  };

  const cancelCustomDateRange = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setShowCustomDatePicker(false);
  };

  const adjustDate = (date: Date, days: number): Date => {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  };

  return (
    <>
      {/* Date Range Selector */}
      <TouchableOpacity
        className="flex-row items-center bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4"
        onPress={() => setShowDatePicker(!showDatePicker)}
      >
        <Text className="text-blue-600 mr-2">📅</Text>
        <Text className="flex-1 text-gray-700 font-medium">{dateRangeText}</Text>
        <Text className="text-gray-500">▼</Text>
      </TouchableOpacity>

      {/* Simple Date Range Picker (when expanded) */}
      {showDatePicker && (
        <View className="mt-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <Text className="text-sm font-semibold text-gray-800 p-3 border-b border-gray-100">
            Select Date Range
          </Text>
          <View className="p-2">
            <TouchableOpacity 
              className="px-3 py-2 rounded-md my-1"
              onPress={handleTodayPress}
            >
              <Text className="text-sm font-medium text-gray-800">Today</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="px-3 py-2 rounded-md my-1"
              onPress={handleLastWeekPress}
            >
              <Text className="text-sm font-medium text-gray-800">Last 7 days</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="px-3 py-2 rounded-md my-1"
              onPress={handleLastMonthPress}
            >
              <Text className="text-sm font-medium text-gray-800">Last 30 days</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="px-3 py-2 rounded-md my-1 border-t border-gray-100 mt-2 pt-3"
              onPress={() => {
                setTempStartDate(startDate);
                setTempEndDate(endDate);
                setShowCustomDatePicker(true);
              }}
            >
              <Text className="text-sm font-medium text-gray-800">📅 Custom Date Range</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Custom Date Range Picker Modal */}
      <Modal visible={showCustomDatePicker} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-5 mx-5 max-w-sm w-full shadow-lg">
            <Text className="text-lg font-semibold text-gray-800 text-center mb-5">
              Select Custom Date Range
            </Text>
            
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-800 mb-2">Start Date</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <Text className="text-sm font-medium text-gray-800">
                  {tempStartDate.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-800 mb-2">End Date</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <Text className="text-sm font-medium text-gray-800">
                  {tempEndDate.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </Text>
              </View>
            </View>

            {/* Quick date adjustment buttons */}
            <View className="mb-5">
              <Text className="text-xs font-semibold text-gray-600 mb-2">Quick Adjustments:</Text>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity 
                  className="bg-gray-100 border border-gray-200 rounded-md px-2 py-1"
                  onPress={() => setTempStartDate(adjustDate(tempStartDate, -1))}
                >
                  <Text className="text-xs font-medium text-gray-800">Start -1d</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-gray-100 border border-gray-200 rounded-md px-2 py-1"
                  onPress={() => setTempStartDate(adjustDate(tempStartDate, 1))}
                >
                  <Text className="text-xs font-medium text-gray-800">Start +1d</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-gray-100 border border-gray-200 rounded-md px-2 py-1"
                  onPress={() => setTempEndDate(adjustDate(tempEndDate, -1))}
                >
                  <Text className="text-xs font-medium text-gray-800">End -1d</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-gray-100 border border-gray-200 rounded-md px-2 py-1"
                  onPress={() => setTempEndDate(adjustDate(tempEndDate, 1))}
                >
                  <Text className="text-xs font-medium text-gray-800">End +1d</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity 
                className="flex-1 bg-gray-100 border border-gray-200 rounded-lg py-3 items-center"
                onPress={cancelCustomDateRange}
              >
                <Text className="text-sm font-semibold text-gray-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-blue-500 rounded-lg py-3 items-center"
                onPress={applyCustomDateRange}
              >
                <Text className="text-sm font-semibold text-white">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DateRangePicker;
