<script setup lang="ts">
defineProps<{
    lang: string
}>()
</script>

<template>
    <div v-if="lang === 'en'" class="space-y-6">
        <h2 class="text-2xl font-bold text-center">Privacy Policy</h2>
        <div class="space-y-4">
            <h3 class="font-semibold text-lg">What We Collect</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-600">
                <li>Email address for waitlist notifications</li>
                <li>Browser language preference for localization</li>
                <li>Basic analytics to improve our service</li>
            </ul>
            <h3 class="font-semibold text-lg">How We Use Your Information</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-600">
                <li>Send you updates about our launch</li>
                <li>Notify you when you can access the platform</li>
                <li>Improve our service based on user preferences</li>
            </ul>
            <h3 class="font-semibold text-lg">Data Protection</h3>
            <p class="text-gray-600">
                We take your privacy seriously. Your email will be stored securely and will never be shared with third
                parties without your explicit consent.
            </p>
        </div>
    </div>
    <div v-else-if="lang === 'ua'" class="space-y-6">
        <h2 class="text-2xl font-bold text-center">Політика конфіденційності</h2>
        <div class="space-y-4">
            <h3 class="font-semibold text-lg">Що ми збираємо</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-600">
                <li>Email для повідомлень про чергу</li>
                <li>Мову браузера для локалізації</li>
                <li>Базові аналітичні дані для поліпшення нашого сервісу</li>
            </ul>
            <h3 class="font-semibold text-lg">Як ми використовуємо вашу інформацію</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-600">
                <li>Відправляємо вам оновлення про запуск</li>
                <li>Повідомляємо, коли ви можете отримати доступ до платформи</li>
                <li>Покращуємо наш сервіс на основі ваших переваг</li>
            </ul>
            <h3 class="font-semibold text-lg">Захист даних</h3>
            <p class="text-gray-600">
                Ми беремо вашу приватність дуже серйозно. Ваш email буде збережений безпечно і ніколи не буде
                поділений з третіми особами без вашої явного згоди.
            </p>
        </div>
    </div>
</template>