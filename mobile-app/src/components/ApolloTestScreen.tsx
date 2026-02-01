import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { useApolloClient } from '@apollo/client';
import { testApolloConnection, logAvailableOperations } from '../utils/apolloHealthCheck';

export default function ApolloTestScreen() {
  const client = useApolloClient();
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'failed'>('idle');
  const [operations, setOperations] = useState<any>(null);

  const testConnection = async () => {
    setConnectionStatus('testing');
    const isConnected = await testApolloConnection(client);
    setConnectionStatus(isConnected ? 'connected' : 'failed');
  };

  const fetchOperations = async () => {
    const ops = await logAvailableOperations(client);
    setOperations(ops);
  };

  useEffect(() => {
    // Auto-test connection when component mounts
    testConnection();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Apollo Client Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Status</Text>
        <Text style={[styles.status, { color: getStatusColor(connectionStatus) }]}>
          {getStatusText(connectionStatus)}
        </Text>
        <Button title="Test Connection" onPress={testConnection} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schema Operations</Text>
        <Button title="Fetch Available Operations" onPress={fetchOperations} />
        
        {operations && (
          <View style={styles.operationsContainer}>
            <Text style={styles.operationsTitle}>Available Queries:</Text>
            {operations.queries?.__schema?.queryType?.fields?.map((field: any, index: number) => (
              <Text key={index} style={styles.operationItem}>• {field.name}</Text>
            ))}
            
            <Text style={styles.operationsTitle}>Available Mutations:</Text>
            {operations.mutations?.__schema?.mutationType?.fields?.map((field: any, index: number) => (
              <Text key={index} style={styles.operationItem}>• {field.name}</Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructions}>
          1. Test the connection to verify Apollo Client setup{'\n'}
          2. Fetch operations to see what's available in the backend{'\n'}
          3. Share the results with the backend team{'\n'}
          4. Update GraphQL operations based on available schema
        </Text>
      </View>
    </ScrollView>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'connected': return '#4CAF50';
    case 'failed': return '#F44336';
    case 'testing': return '#FF9800';
    default: return '#757575';
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'idle': return 'Ready to test';
    case 'testing': return 'Testing connection...';
    case 'connected': return 'Connected successfully ✅';
    case 'failed': return 'Connection failed ❌';
    default: return 'Unknown status';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  operationsContainer: {
    marginTop: 10,
  },
  operationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  operationItem: {
    fontSize: 14,
    color: '#666',
    paddingLeft: 10,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
