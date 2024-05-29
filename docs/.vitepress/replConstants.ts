export const defaultTemplate = `<script setup>
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <v-app>
    <v-app-bar app>
        <v-toolbar-title>Welcome to the VuePrint Component Playground</v-toolbar-title>
    </v-app-bar>
    <v-main>
        <v-container class="fill-height" fluid>
            <v-row justify="center">
                <v-col cols="12" md="6" lg="4" xxl="3">
                    <v-card>
                        <v-card-text>
                            <v-text-field v-model="msg" label="Type something here"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" @click="msg = 'Hello World!'">Reset</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
  </v-app>
</template>
`