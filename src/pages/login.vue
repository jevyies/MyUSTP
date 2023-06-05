<script setup>
import { useGenerateImageVariant } from "@/@core/composable/useGenerateImageVariant";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2LoginMaskDark from "@images/pages/auth-v2-login-mask-dark.png";
import authV2LoginMaskLight from "@images/pages/auth-v2-login-mask-light.png";
import LoginAnimations from "@/views/login-animations.vue";
import GoogleBtn from "@/views/google-btn.vue";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { useAuthenticationStore } from "@store/authentication";
import { requiredValidator } from "@validators";
import { useAppAbility } from "@/plugins/casl/useAppAbility";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import { useTheme } from "vuetify";

const isPasswordVisible = ref(false);
const authV2LoginMask = useGenerateImageVariant(
  authV2LoginMaskLight,
  authV2LoginMaskDark
);
const authV2LoginIllustration = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const route = useRoute();
const router = useRouter();
const loginStore = useAuthenticationStore();
const errors = ref({ email: undefined, password: undefined });
const ability = useAppAbility();
const { global } = useTheme();
const currentSkin = ref(global.name.value);
const refVForm = ref();
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const toast = inject("toast");
const globalFunctions = inject("globalFunctions");

watch(global.name, (val) => {
  currentSkin.value = val;
});
const login = async () => {
  let data = {
    userName: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
  };
  try {
    const { data: response } = await loginStore.login(data);
    if (response.error) {
      return toast.value.showMessage(response.errorMessage, "error");
    }
    const { token: accessToken, refreshToken } = response;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    const {
      FirstName: firstname,
      LastName: lastname,
      IsAdmin: isAdmin,
      MiddleName: middlename,
    } = globalFunctions.convertToken(accessToken);
    var fullName = `${firstname} ${lastname}`;
    localStorage.setItem(
      "userData",
      JSON.stringify({
        firstname,
        middlename,
        lastname,
        fullName,
        role: isAdmin.toLowerCase() === "true" ? "Admin" : "User",
      })
    );
    var userAbilities = [];
    if (isAdmin.toLowerCase() === "true") {
      userAbilities = [
        {
          action: "manage",
          subject: "all",
        },
      ];
    } else {
      userAbilities = [
        {
          action: "read",
          subject: "Auth",
        },
        {
          action: "read",
          subject: "MereUser",
        },
      ];
    }

    localStorage.setItem(
      "userAbilities",
      globalFunctions.encryptData(userAbilities)
    );
    ability.update(userAbilities);
    router.go(route.query.to ? String(route.query.to) : "/");
  } catch (e) {
    return toast.value.showMessage("Something went wrong", "error");
  }
};

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) login();
  });
};
</script>

<template>
  <div class="position-relative overflow-hidden">
    <div class="auth-logo d-flex align-center gap-x-2">
      <div>
        <VNodeRenderer :nodes="themeConfig.app.logo" />
      </div>

      <h5 class="text-h5 font-weight-bold leading-normal text-capitalize">
        {{ themeConfig.app.title }}
      </h5>
    </div>
    <VRow no-gutters class="auth-wrapper">
      <VCol
        md="8"
        class="d-none d-md-flex align-center justify-center position-relative"
      >
        <LoginAnimations/>

      </VCol>

      <VCol
        cols="12"
        md="4"
        class="auth-card-v2 d-flex align-center justify-center wavy-background-success"
      >
        <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4 border">
          <VCardText>
            <h5 class="text-h5 font-weight-semibold mb-1">
              Welcome to {{ themeConfig.app.title }}!
            </h5>
            <p class="mb-0">
              Please sign-in to your account and start the adventure
            </p>
          </VCardText>
          <VCardText>
            <VForm ref="refVForm" @submit.prevent="onSubmit">
              <VRow>
                <!-- email -->
                <VCol cols="12">
                  <VTextField
                    v-model="email"
                    label="Username"
                    density="comfortable"
                    type="text"
                    :rules="[requiredValidator]"
                    :error-messages="errors.email"
                  />
                </VCol>

                <!-- password -->
                <VCol cols="12">
                  <VTextField
                    v-model="password"
                    label="Password"
                    density="comfortable"
                    :rules="[requiredValidator]"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :error-messages="errors.password"
                    :append-inner-icon="
                      isPasswordVisible
                        ? 'mdi-eye-off-outline'
                        : 'mdi-eye-outline'
                    "
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />

                  <div
                    class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4"
                  >
                    <VCheckbox v-model="rememberMe" label="Remember me" />
                    <RouterLink
                      class="text-primary ms-2 mb-1"
                      :to="{ name: 'forgot-password' }"
                    >
                      Forgot Password?
                    </RouterLink>
                  </div>

                  <VBtn block type="submit"> Login </VBtn>
                </VCol>
                <VCol cols="12" class="d-flex align-center">
                  <VDivider />
                  <span class="mx-4">or</span>
                  <VDivider />
                </VCol>
                <div class="ma-auto">
                  <GoogleBtn />
                </div>
                <VDivider class="mt-5 mb-2"/>
                <!-- create account -->
                <VCol cols="12" class="text-base text-center">
                  <span>New on this platform?</span>
                  <RouterLink
                    class="text-primary ms-2"
                    :to="{ name: 'register' }"
                  >
                    Create an account
                  </RouterLink>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <div class="position-fixed" style="z-index: 100; top: 10px; right: 10px;">
      <VAvatar class="border">
        <NavbarThemeSwitcher />
      </VAvatar>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
