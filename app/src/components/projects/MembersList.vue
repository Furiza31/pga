<template>
  <div class="members-list">
    <h3 class="text-lg font-semibold mb-4">Project Members</h3>

    <div v-if="loading" class="text-center py-4">
      <div
        class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"
      ></div>
      <p class="mt-1 text-sm text-gray-600">Loading members...</p>
    </div>

    <div
      v-else-if="members.length === 0"
      class="text-center py-6 text-gray-500"
    >
      <p>No members in this project yet.</p>
    </div>

    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-100">
            <tr>
              <th
                class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Joined
              </th>
              <th
                class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                v-if="canManageMembers"
                class="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="member in members" :key="member.id">
              <td class="py-3 px-4 text-sm">{{ member.name }}</td>
              <td class="py-3 px-4 text-sm text-gray-600">
                {{ member.email }}
              </td>
              <td class="py-3 px-4 text-sm text-gray-600">
                {{ formatDate(member.joined_at) }}
              </td>
              <td class="py-3 px-4">
                <span
                  v-if="member.is_creator"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  Creator
                </span>
                <span v-else class="text-sm text-gray-600">Member</span>
              </td>
              <td v-if="canManageMembers" class="py-3 px-4 text-right">
                <button
                  v-if="canRemoveMember(member)"
                  @click="confirmRemove(member)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="showConfirmDialog"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-md">
          <h4 class="text-lg font-bold mb-3">Confirm Member Removal</h4>
          <p class="mb-4">
            Are you sure you want to remove {{ selectedMember?.name }} from this
            project?
          </p>
          <div class="flex justify-end">
            <button
              @click="showConfirmDialog = false"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              @click="removeMember"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              :disabled="removingMember"
            >
              <span v-if="removingMember">Removing...</span>
              <span v-else>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ProjectMember } from "@/types/project";
import { computed, ref } from "vue";

const props = defineProps<{
  members: ProjectMember[];
  loading: boolean;
  projectCreatorId?: number;
}>();

const emit = defineEmits<{
  (e: "remove", userId: number): void;
}>();

const authStore = useAuthStore();
const showConfirmDialog = ref(false);
const selectedMember = ref<ProjectMember | null>(null);
const removingMember = ref(false);

// Check if the current user can manage members
const canManageMembers = computed(() => {
  // Admin can always manage members
  if (authStore.user?.role === "admin") return true;

  // Project creator can manage members
  return authStore.user?.id === props.projectCreatorId;
});

// Check if the specific member can be removed
const canRemoveMember = (member: ProjectMember) => {
  // Can't remove the creator
  if (member.is_creator) return false;

  // Users can remove themselves
  if (member.id === authStore.user?.id) return true;

  // Return if the current user can manage members
  return canManageMembers.value;
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Functions for removing members
const confirmRemove = (member: ProjectMember) => {
  selectedMember.value = member;
  showConfirmDialog.value = true;
};

const removeMember = async () => {
  if (!selectedMember.value) return;

  removingMember.value = true;
  try {
    await emit("remove", selectedMember.value.id);
    showConfirmDialog.value = false;
  } finally {
    removingMember.value = false;
  }
};
</script>
