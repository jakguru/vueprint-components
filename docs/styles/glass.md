# Frosted Glass Utility Classes

By importing `@jakguru/vueprint-components/styles/glass`, you will have access to the frosted glass utility classes which are designed to create a frosted-glass effect using a combination of the CSS `backdrop-filter` and CSS `background-color`.

The colors available for the frosted glass include all of the [Vuetify Material color pallette](https://vuetifyjs.com/en/styles/colors/), as well as the current [VuePrint Theme's Colors](https://jakguru.github.io/vueprint/api/interfaces/jakguru_vueprint_services_vuetify.VuetifiableColors.html). All colors also have 11 levels of intensity.

## Classes

<script lang="ts" setup>
    import { kebabCase } from "change-case";
    import vuetifyColors from 'vuetify/util/colors'
    const themeColors = [
        "accent",
        "background",
        "cancel",
        "error",
        "highlight",
        "info",
        "notify",
        "primary",
        "question",
        "secondary",
        "success",
        "surface",
        "warning",
    ].filter((k) => !['shades'].includes(k)).map((k) => kebabCase(k))
    const themeColorVariations = [
        "lighten-5",
        "lighten-4",
        "lighten-3",
        "lighten-2",
        "lighten-1",
        "darken-1",
        "darken-2",
        "darken-3",
        "darken-4",
        "darken-5"
    ]
    const coreColors = [...Object.keys(vuetifyColors)].filter((k) => !['shades'].includes(k)).map((k) => kebabCase(k))
    const coreColorVariations = [
        "lighten-5",
        "lighten-4",
        "lighten-3",
        "lighten-2",
        "lighten-1",
        "darken-1",
        "darken-2",
        "darken-3",
        "darken-4"
    ]
    const glassAlphaVariations = [
        "soften-5",
        "soften-4",
        "soften-3",
        "soften-2",
        "soften-1",
        "intensify-1",
        "intensify-2",
        "intensify-3",
        "intensify-4",
        "intensify-5",
    ]
</script>

<style lang="scss">
    .glass-demo-container {
        background-image: url('/frosted-background.webp') !important;
        min-height: 100px !important;
        background-repeat: no-repeat !important;
        background-size: cover !important;
    }
</style>

<v-container fluid>
    <v-row>
        <v-col v-for="(color) in themeColors" cols="12" md="6" lg="4" xxl="3">
            <v-sheet color="white" class="glass-demo-container">
                <v-toolbar :color="color" density="compact">
                    <v-toolbar-title>{{ color }}</v-toolbar-title>
                </v-toolbar>
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-toolbar color="transparent" :class="`glass-${color} my-1`" density="compact">
                            <div class="h-100 d-flex align-center px-3">
                                <span>.glass-{{ color }}</span>
                            </div>
                            <v-spacer />
                            <v-toolbar-items>
                                <v-btn icon v-bind="props">
                                    <v-icon>mdi-dots-horizontal</v-icon>
                                </v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                    </template>
                    <v-sheet color="white" class="glass-demo-container px-1">
                        <v-toolbar v-for="(alphaVariant) in glassAlphaVariations" color="transparent" :class="`glass-${color}-${alphaVariant} my-1`" density="compact">
                            <div class="h-100 d-flex align-center px-3">
                                <span>.glass-{{ color }}-{{alphaVariant}}</span>
                            </div>
                        </v-toolbar>
                    </v-sheet>
                </v-menu>
                <v-menu v-for="(variant) in themeColorVariations">
                    <template v-slot:activator="{ props }">
                        <v-toolbar color="transparent" :class="`glass-${color}-${variant} my-1`" density="compact">
                            <div class="h-100 d-flex align-center px-3">
                                <span>.glass-{{ color }}-{{ variant }}</span>
                            </div>
                            <v-spacer />
                            <v-toolbar-items>
                                <v-btn icon v-bind="props">
                                    <v-icon>mdi-dots-horizontal</v-icon>
                                </v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                    </template>
                    <v-sheet color="white" class="glass-demo-container px-1">
                        <v-toolbar v-for="(alphaVariant) in glassAlphaVariations" color="transparent" :class="`glass-${color}-${variant}-${alphaVariant} my-1`" density="compact">
                            <div class="h-100 d-flex align-center px-3">
                                <span>.glass-{{ color }}-{{variant}}-{{alphaVariant}}</span>
                            </div>
                        </v-toolbar>
                    </v-sheet>
                </v-menu>
            </v-sheet>
        </v-col>
        <v-col v-for="(color) in coreColors" cols="12" md="6" lg="4" xxl="3">
            <v-sheet color="white" class="glass-demo-container">
                <v-toolbar :color="color" density="compact">
                    <v-toolbar-title>{{ color }}</v-toolbar-title>
                </v-toolbar>
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-toolbar color="transparent" :class="`glass-${color} my-1`" density="compact">
                            <div class="h-100 d-flex align-center px-3">
                                <span>.glass-{{ color }}</span>
                            </div>
                            <v-spacer />
                            <v-toolbar-items>
                                <v-btn icon v-bind="props">
                                    <v-icon>mdi-dots-horizontal</v-icon>
                                </v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                    </template>
                    <v-sheet color="white" class="glass-demo-container px-1">
                        <v-toolbar v-for="(alphaVariant) in glassAlphaVariations" color="transparent" :class="`glass-${color}-${alphaVariant} my-1`" density="compact">
                            <div class="h-100 d-flex align-center px-3">
                                <span>.glass-{{ color }}-{{alphaVariant}}</span>
                            </div>
                        </v-toolbar>
                    </v-sheet>
                </v-menu>
                <v-menu v-for="(variant) in coreColorVariations">
                    <template v-slot:activator="{ props }">
                        <v-toolbar color="transparent" :class="`glass-${color}-${variant} my-1`" density="compact">
                            <div class="h-100 d-flex align-center px-3">
                                <span>.glass-{{ color }}-{{ variant }}</span>
                            </div>
                            <v-spacer />
                            <v-toolbar-items>
                                <v-btn icon v-bind="props">
                                    <v-icon>mdi-dots-horizontal</v-icon>
                                </v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                    </template>
                    <v-sheet color="white" class="glass-demo-container px-1">
                        <v-toolbar v-for="(alphaVariant) in glassAlphaVariations" color="transparent" :class="`glass-${color}-${variant}-${alphaVariant} my-1`" density="compact">
                            <div class="h-100 d-flex align-center px-3">
                                <span>.glass-{{ color }}-{{variant}}-{{alphaVariant}}</span>
                            </div>
                        </v-toolbar>
                    </v-sheet>
                </v-menu>
            </v-sheet>
        </v-col>
    </v-row>
</v-container>
