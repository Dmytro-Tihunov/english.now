<script setup lang="ts">
defineProps<{
    lang: string
}>()
</script>

<template>
    <div v-if="lang === 'en'" class="space-y-6">
        <h2 class="text-2xl font-bold text-center">Terms of Service</h2>
        <div class="space-y-4">
            <h3 class="font-semibold text-lg">Waitlist Terms</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-600">
                <li>Joining the waitlist does not guarantee immediate access to the platform</li>
                <li>Access will be granted in phases based on our launch schedule</li>
                <li>We reserve the right to modify the waitlist process</li>
            </ul>
            <h3 class="font-semibold text-lg">Platform Features</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-600">
                <li>Personalized learning paths from A1 to C2 levels</li>
                <li>Interactive exercises and real-time feedback</li>
                <li>Progress tracking and achievement system</li>
                <li>Community features for peer learning</li>
            </ul>
            <h3 class="font-semibold text-lg">User Responsibilities</h3>
            <p class="text-gray-600">
                As a waitlist member, you agree to provide accurate information and maintain the security of your
                account credentials.
            </p>
        </div>
    </div>
    <div v-else-if="lang === 'ua'" class="space-y-6">
        <h2 class="text-2xl font-bold text-center">Умови обслуговування</h2>
        <div class="space-y-4">
            <h3 class="font-semibold text-lg">Умови черги</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-600">
                <li>Приєднання до черги не гарантує негайного доступу до платформи</li>
                <li>Доступ буде наданий в етапах на основі нашого графіку запуску</li>
                <li>Ми зберігаємо право на зміну процесу черги</li>
            </ul>
            <h3 class="font-semibold text-lg">Функції платформи</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-600">
                <li>Персоналізовані навчальні шляхи від A1 до C2 рівнів</li>
                <li>Інтерактивні вправи та реальний час зворотний зв'язок</li>
                <li>Система відстеження прогресу та досягнень</li>
                <li>Функції спільноти для спільного навчання</li>
            </ul>
            <h3 class="font-semibold text-lg">Відповідальність користувача</h3>
            <p class="text-gray-600">
                Як член черги, ви погоджуєтеся надавати точну інформацію та підтримувати безпеку своїх
                облікових даних.
            </p>
        </div>
    </div>
</template>