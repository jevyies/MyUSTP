<script setup>
import ApplicationModal from "@/views/admin/ApplicationModal.vue";
import avatar1 from "@images/avatars/avatar-1.png";
import pages2 from "@images/pages/2.png";
import { localApi } from "@axios";
import { useAppStore } from "@store/app";
import { avatarText } from "@core/utils/formatters";

const router = useRouter();
const isAppModalVisible = ref(false);
const modalTitle = ref("");
const modalSubTitle = ref("");
const appStore = useAppStore();
const websites = ref([]);
const gridStyle = ref(2);
const websiteLoading = ref(false);
const toast = inject("toast");
const swal = inject("swal");
const globalRefs = inject("globalRefs");
const appSearch = ref("");
const isSnackbarVisible = ref(false);
const favoriteWebsites = ref([]);

const fetchIcons = async (website, add = false) => {
  try {
    const { data } = await localApi.get(`${encodeURIComponent(website.url)}`);
    if (add) {
      let index = websites.value.findIndex((item) => item.id == website.id);
      websites.value[index].image = data.screenshot
        ? `data:image/jpeg;base64, ${data.screenshot}`
        : null;
      websites.value[index].icon = data.favIcon;
    } else {
      website.image = data.screenshot
        ? `data:image/jpeg;base64, ${data.screenshot}`
        : null;
      website.icon = data.favIcon;
    }
  } catch (error) {
    website.image = null;
    website.icon = null;
  }
};
const fetchFavorites = async () => {
  try{
    const { data } = await localApi.get(`get/favorites`);
    favoriteWebsites.value = data;
  }catch(error){}
};
const fetchApps = async () => {
  websiteLoading.value = true;
  const { data } = await appStore.getAllApps();
  data.map((app) => {
    app.urlAddress = `https://${app.url}`;
    app.image = null;
    app.icon = null;
    app.favorite = favoriteWebsites.value.findIndex((item) => item === app.url) > -1;
  });
  websites.value = data;
  websiteLoading.value = false;
  for (const website of websites.value) {
    await fetchIcons(website);
  }
};
// watchEffect(fetchApps);
onMounted(async() => {
  await fetchFavorites();
  fetchApps();
});

const optionList = computed(() => {
  return (params) => [
    {
      title: "View Details",
      value: "view",
      prependIcon: "mdi-eye-outline",
      color: "default",
      params: params,
    },
    {
      title: "Edit",
      value: "edit",
      prependIcon: "mdi-pencil-outline",
      color: "default",
      params: params,
    },
    {
      title: "Delete",
      value: "delete",
      prependIcon: "mdi-delete-outline",
      color: "error",
      params: params,
    },
  ];
});

const optionClick = (item) => {
  if (item.value === "view") {
    router.push({ name: "admin-app-id", params: { id: item.params.id } });
  } else if (item.value === "edit") {
    editApplication(item.params);
  } else if (item.value === "delete") {
    deleteApplication(item.params);
  }
};
const appData = ref({
  id: 0,
  name: "",
  description: "",
  url: "",
});
const addApplication = () => {
  isAppModalVisible.value = true;
  modalTitle.value = "Add Application";
  modalSubTitle.value =
    "Specify the details of the application you want to add.";
  appData.value = {
    id: 0,
    name: "",
    description: "",
    url: "",
  };
};

const addNewApp = async (appData) => {
  if (appData.id > 0) {
    try {
      await appStore.updateApp(appData);
      let index = websites.value.findIndex(
        (website) => website.id === appData.id
      );
      websites.value[index] = appData;
      isAppModalVisible.value = false;
      toast.value.showMessage("Successfully updated!", "success");
    } catch (error) {
      toast.value.showMessage("Something went wrong!", "error");
    }
  } else {
    try {
      const { data } = await appStore.createApp(appData);
      data.image = null;
      data.icon = null;
      data.urlAddress = `https://${data.url}`;
      isAppModalVisible.value = false;
      websites.value.push(data);
      toast.value.showMessage("Successfully added!", "success");
      await fetchIcons(data, true);
    } catch (error) {
      toast.value.showMessage("Something went wrong!", "error");
    }
  }
};
const editApplication = (params) => {
  isAppModalVisible.value = true;
  modalTitle.value = "Edit Application";
  modalSubTitle.value =
    "Specify the details of the application you want to edit.";
  appData.value = params;
};

const deleteApplication = async (appData) => {
  swal.value
    .fire({
      question: `Are you sure you want to delete ${appData.name}?`,
      dangerMode: true,
    })
    .then(async (result) => {
      if (result) {
        try {
          await appStore.deleteApp(appData.id);
          let index = websites.value.findIndex(
            (website) => website.id === appData.id
          );
          websites.value.splice(index, 1);
          toast.value.showMessage("Successfully deleted!", "success");
        } catch (error) {
          toast.value.showMessage("Something went wrong!", "error");
        }
      }
    });
};
const filteredApps = computed(() => {
  return websites.value.filter((website) => {
    return website.name.toLowerCase().includes(appSearch.value.toLowerCase());
  });
});

const addToFavorites = async (website) => {
  if(favoriteWebsites.value.length == 6 && !website.favorite){
    toast.value.showMessage("You can only add up to 6 favorites!", "error");
    return;
  }
  try {
    const { data } = await localApi.post(`add-to-favorites`, { url: website.url, fav: !website.favorite});
    if(data.success){
      website.favorite = !website.favorite;
      if(website.favorite){
        favoriteWebsites.value.push(website.url);
      }else{
        let index = favoriteWebsites.value.findIndex((item) => item === website.url);
        favoriteWebsites.value.splice(index, 1);
      }
      isSnackbarVisible.value = website.favorite ?? true;
    }
  } catch (error) {
    toast.value.showMessage("Something went wrong!", "error");
  }
};
</script>
<template>
  <section>
    <div class="mb-2">
      <h1>Applications</h1>
      <p>Here you can manage your applications.</p>
    </div>
    <div class="d-flex flex-row" style="gap: 8px;">
      <VTextField
        prepend-inner-icon="mdi-search"
        density="compact"
        single-line
        placeholder="Search for an application..."
        v-model="appSearch"
      />
      <div class="border rounded d-flex align-center px-2">
        <div
          class="px-1 rounded border me-1 bg-dark cursor-pointer"
          @click="gridStyle = 2"
        >
          <VIcon
            icon="mdi-apps"
            :color="gridStyle == 2 ? 'primary' : 'secondary'"
          />
        </div>
        <div
          class="px-1 rounded border bg-dark cursor-pointer"
          @click="gridStyle = 1"
        >
          <VIcon
            icon="mdi-format-list-bulleted"
            :color="gridStyle == 1 ? 'primary' : 'secondary'"
          />
        </div>
      </div>
      <VBtn color="primary" @click="addApplication">
        <VIcon icon="mdi-plus" />
        Add New
      </VBtn>
    </div>
    <div
      class="mt-4 d-flex align-center justify-center border rounded"
      style="height: 500px;"
      v-if="websites.length == 0"
    >
      <div v-if="websiteLoading" class="d-flex align-center">
        <VProgressCircular
          indeterminate
          color="primary"
          size="35"
          class="me-2"
        />Loading apps...
      </div>
      <span
        class="text-warning d-flex align-end"
        v-if="!websiteLoading && websites.length == 0"
        ><VIcon icon="mdi-alert-outline"></VIcon> No data found.</span
      >
    </div>
    <div class="mt-4" v-if="!websiteLoading && websites.length > 0">
      <VRow>
        <VCol
          cols="12"
          :md="gridStyle == 1 ? 12 : 4"
          :sm="gridStyle == 1 ? 12 : 6"
          v-for="website in filteredApps"
          :key="website.name"
        >
          <VCard v-if="gridStyle == 1">
            <div
              class="d-flex flex-wrap flex-md-nowrap flex-column flex-md-row justify-space-between align-center"
            >
              <VCardItem>
                <div class="d-flex align-center">
                  <VAvatar
                    size="45"
                    :image="`${website.icon}`"
                    class="me-2 bg-grey p5"
                    v-if="website.icon"
                  />
                  <VAvatar size="45" class="me-2 bg-grey p5" v-else>
                    <h2 class="text-primary">{{ avatarText(website.name) }}</h2>
                  </VAvatar>
                  <div>
                    <h3>{{ website.name }}</h3>
                    <VCardSubtitle class="mb-0"
                      ><a :href="website.urlAddress" target="_blank"
                        >{{ website.url }} <VIcon icon="mdi-open-in-new" /></a
                    ></VCardSubtitle>
                  </div>
                </div>
              </VCardItem>
              <VCardActions class="p0 me-2">
                <MoreBtn
                  :menu-list="optionList(website)"
                  :item-props="true"
                  @item-click="optionClick"
                />
              </VCardActions>
            </div>
          </VCard>
          <VCard v-else>
            <div class="position-relative">
              <div
                class="position-absolute"
                style="z-index: 100; top: 5px; right: 5px;"
              >
                <VIcon
                  :icon="website.favorite ? `mdi-heart` : `mdi-heart-outline`"
                  color="error"
                  size="30"
                  class="cursor-pointer"
                  @click="addToFavorites(website)"
                />
              </div>
              <VImg
                v-if="website.image"
                :src="website.image"
                height="178"
                cover
              />
              <VAvatar
                v-else
                rounded
                :size="178"
                variant="tonal"
                class="bg-primary w-100"
              >
                {{ website.url }}
              </VAvatar>
            </div>
            <VCardText class="position-relative">
              <VAvatar
                size="75"
                class="avatar-center bg-grey p5"
                :image="`${website.icon}`"
                v-if="website.icon"
              />
              <VAvatar size="75" class="avatar-center bg-grey p5" v-else>
                <h2 class="text-primary">{{ avatarText(website.name) }}</h2>
              </VAvatar>
              <div
                class="d-flex justify-space-between align-center flex-wrap mt-6 mb-2"
              >
                <div class="me-2">
                  <VCardTitle class="pa-0">
                    {{ website.name }}
                  </VCardTitle>
                  <VCardSubtitle class="text-caption pa-0">
                    <a :href="website.urlAddress" target="_blank">{{
                      website.url
                    }}</a>
                  </VCardSubtitle>
                </div>
                <VMenu>
                  <template #activator="{ props }">
                    <VBtn v-bind="props">
                      <VIcon icon="mdi-cog" class="me-1"> </VIcon> Options
                    </VBtn>
                  </template>
                  <VList density="compact">
                    <VListItem
                      @click="optionClick(item)"
                      v-for="item in optionList(website)"
                      :key="item.value"
                      :class="`text-${item.color}`"
                    >
                      <template #prepend>
                        <VIcon :icon="item.prependIcon" />
                      </template>
                      <VListItemTitle>{{ item.title }}</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
    <ApplicationModal
      v-model:isDialogVisible="isAppModalVisible"
      :app-data="appData"
      :title="modalTitle"
      :sub-title="modalSubTitle"
      @submit="addNewApp"
    />
    <VSnackbar v-model="isSnackbarVisible">
      <VIcon icon="mdi-heart" color="error" size="30" class="me-2" /> Added to
      favorites
    </VSnackbar>
  </section>
</template>

<style lang="scss" scoped>
.avatar-center {
  position: absolute;
  border: 5px solid rgb(var(--v-theme-grey-200));
  inset-block-start: -2rem;
  inset-inline-start: 1rem;
}

.v-card-item .v-card-subtitle {
  padding: 0;
}

.bg-grey {
  background: rgb(var(--v-theme-grey-200));
}

.p5 {
  padding: 5px;
}

.p0 {
  padding: 0;
}
</style>
