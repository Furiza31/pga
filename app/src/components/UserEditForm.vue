<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white shadow-md rounded-lg p-6"
  >
    <div v-if="loading" class="text-center py-4">Loading user data...</div>

    <div v-else class="grid grid-cols-1 gap-6">
      <!-- Name Field -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Name</label
        >
        <input
          v-model="form.name"
          type="text"
          id="name"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.name }"
          required
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">
          {{ errors.name }}
        </p>
      </div>

      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email</label
        >
        <input
          v-model="form.email"
          type="email"
          id="email"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.email }"
          required
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password Field -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
          Password
          <span class="text-gray-400 text-xs"
            >(Leave empty to keep current password)</span
          >
        </label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.password }"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">
          {{ errors.password }}
        </p>
      </div>

      <!-- Role Field -->
      <div>
        <label for="role" class="block text-sm font-medium text-gray-700"
          >Role</label
        >
        <select
          v-model="form.role"
          id="role"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="button"
          @click="$router.back()"
          class="mr-3 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          :disabled="saving"
        >
          {{ saving ? "Saving..." : "Save Changes" }}
        </button>
      </div>

      <!-- Form Error -->
      <div v-if="formError" class="text-red-600 text-center">
        {{ formError }}
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useUsersStore } from "@/stores/users";
import type { User } from "@/types/auth";
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{
  userId?: number;
}>();

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const userId = ref(props.userId || parseInt(route.params.id as string));
const loading = ref(true);
const saving = ref(false);
const formError = ref("");

const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "member" as "admin" | "member",
});

const errors = reactive({
  name: "",
  email: "",
  password: "",
});

const loadUserData = async () => {
  loading.value = true;
  try {
    const user = await usersStore.fetchUserById(userId.value);
    form.name = user.name;
    form.email = user.email;
    form.role = user.role;
  } catch (error: any) {
    console.error("Error fetching user:", error);
    formError.value = error.message || "Could not load user data";
  } finally {
    loading.value = false;
  }
};

onMounted(loadUserData);

// Watch for changes to userId (if component is reused)
watch(
  () => props.userId,
  (newId) => {
    if (newId && newId !== userId.value) {
      userId.value = newId;
      loadUserData();
    }
  }
);

const validateForm = () => {
  let isValid = true;

  // Reset errors
  errors.name = "";
  errors.email = "";
  errors.password = "";
  formError.value = "";

  // Validate name
  if (!form.name.trim()) {
    errors.name = "Name is required";
    isValid = false;
  }

  // Validate email
  if (!form.email) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  // Validate password only if it's provided (optional on edit)
  if (form.password && form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  saving.value = true;
  formError.value = "";

  try {
    // Only include password in the update if it was changed
    const userData: Partial<User> & { password?: string } = {
      name: form.name,
      email: form.email,
      role: form.role,
    };

    if (form.password) {
      userData.password = form.password;
    }

    await usersStore.updateUser(userId.value, userData);
    router.push("/admin/users");
  } catch (error: any) {
    formError.value =
      error.message || "Failed to update user. Please try again.";
  } finally {
    saving.value = false;
  }
};
</script>
