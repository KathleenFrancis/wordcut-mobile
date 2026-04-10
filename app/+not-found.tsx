import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Sizes } from '../constants/Sizes';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={100} color={Colors.gray[400]} />
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>Page not found</Text>
      
      <Link href="/" asChild>
        <Pressable style={styles.button}>
          <Ionicons name="home" size={Sizes.icon.sm} color={Colors.white} />
          <Text style={styles.buttonText}>Go Home</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    padding: Sizes.spacing.lg,
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginTop: Sizes.spacing.lg,
  },
  subtitle: {
    fontSize: Sizes.fontSize.xl,
    color: Colors.gray[600],
    marginBottom: Sizes.spacing.xxl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
    backgroundColor: Colors.primary.blue,
    paddingHorizontal: Sizes.spacing.xl,
    paddingVertical: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    ...Sizes.shadow.medium,
  },
  buttonText: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.white,
  },
});
