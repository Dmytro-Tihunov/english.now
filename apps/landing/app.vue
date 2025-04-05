<script setup lang="ts">
import confetti from 'canvas-confetti'

const email = ref('')
const isSubmitting = ref(false)
const error = ref('')
const success = ref(false)
const lang = ref('ua')
const showPrivacyModal = ref(false)
const showTermsModal = ref(false)

const tranlations: any = {
  ua: {
    title: 'Від нуля до вільного спілкування — твій шлях, твій темп, наш відкритий код.',
    description: 'Перша українська платформа з відкритим кодом для самостійного вивчення англійської мови.',
  },
  en: {
    title: 'From zero to fluency — your path, your pace, our open-source code.',
    description: 'The first Ukrainian open-source platform for self-learning English.',
  }
}

const t = (key: string) => {
  return tranlations[lang.value][key]
}

onMounted(() => {
  const browserLang = navigator.language.toLocaleLowerCase()

  if (browserLang.includes('ua')) {
    lang.value = 'ua'
  } else {
    lang.value = 'en'
  }
})
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const handleSubmit = async () => {
  error.value = ''
  success.value = false

  if (!email.value) {
    error.value = 'Будь ласка, введіть email'
    return
  }

  if (!validateEmail(email.value)) {
    error.value = 'Будь ласка, введіть коректний email'
    return
  }

  try {
    isSubmitting.value = true
    const { data } = await useFetch<any>('/api/add', {
      method: 'POST',
      body: { email: email.value },
    })

    if (data.value.message) {
      success.value = true
      email.value = ''
      triggerConfetti()
      setTimeout(() => {
        success.value = false
      }, 4000)
    } else {
      error.value = 'Щось пішло не так. Спробуйте пізніше.'
    }
  } catch (e) {
    error.value = 'Щось пішло не так. Спробуйте пізніше.'
  } finally {
    isSubmitting.value = false
  }
}

const triggerConfetti = () => {
  const duration = 3 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { 
    startVelocity: 30, 
    spread: 360, 
    ticks: 60, 
    zIndex: 0, 
    colors: ['#FFDBFE', '#FF603E', '#10CD7E', '#ffffff'] 
  }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    
    // Multiple confetti bursts from different angles
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    })
    confetti({
      ...defaults,
      particleCount: particleCount * 0.5,
      origin: { x: randomInRange(0.4, 0.6), y: Math.random() - 0.2 },
      scalar: 0.8
    })
  }, 250)
}

useSeoMeta({
  title: computed(() => lang.value === 'ua' ? 'English Now - Ефективне самостійне вивчення англійської мови | Від A1 до C2' : 'English Now - Effective self-learning of English | From A1 to C2'),
  description: computed(() => lang.value === 'ua' ? 'English Now - перша українська платформа з відкритим кодом для самостійного вивчення англійської мови. Прогресуйте від початківця до вільного спілкування у власному темпі з інтерактивними вправами, тестами та персоналізованим навчальним планом.' : 'English Now - the first Ukrainian open-source platform for self-learning English. Progress from beginner to free conversation at your own pace with interactive exercises, tests and personalized learning plan.'),
  keywords: computed(() => lang.value === 'ua' ? 'вивчення англійської, самостійне навчання, англійська онлайн, відкритий код, англійська для українців, A1, B1, C1, C2, мовні курси' : 'learning English, self-learning, English online, open source, English for Ukrainians, A1, B1, C1, C2, language courses'),
})
</script>

<template>
  <div style="font-family: 'Roboto', sans-serif;"
    class="min-h-screen max-h-screen bg-gradient-to-b from-[#FFDBFE]/30 to-[#FF603E] flex flex-col">
    <div class="text-center max-w-7xl mx-auto pt-12 md:pt-18 2xl:pt-24 md:mb-12 px-4 md:px-0">
      <div
        class="flex flex-col size-16 md:size-20 bg-white relative mx-auto bg-gradient-to-b from-[#FFDBFE]/30 to-[#FF603E] overflow-hidden rounded-2xl md:rounded-3xl border-2 shadow-xl border-black items-center">
        <img src="/logo_str.svg" alt="English Now" class="absolute bottom-[-30%]">
      </div>
      <div class="relative mt-8 md:mt-12 inline-block">
        <p class="text-sm md:text-xl font-medium text-black/60">
          {{ t('description') }}
        </p>
        <h1 style="font-family: 'Dela Gothic One', sans-serif;"
          class="text-[36px] mt-4 md:mt-2 md:text-[55px] leading-tight text-black">
          {{ t('title') }}
        </h1>
      </div>
    </div>
    <main class="flex-grow flex flex-col items-center pt-40 md:pt-60">
      <div class="w-full max-w-md px-4 relative">
        <Logo class="w-48 h-48 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[99%]" />
        <form @submit.prevent="handleSubmit" class="relative bg-transparent">
          <input v-model="email" style="font-family: 'Dela Gothic One', sans-serif;" type="email"
            placeholder="your@email.com" :class="[
              'w-full border-2 border-black px-6 py-6 text-xl md:text-2xl rounded-full bg-white text-gray-800 pr-14 focus:outline-none placeholder:text-gray-300 transition-all duration-500',
              error ? 'border-red-500' : '',
              success ? 'border-[#10CD7E] scale-105 shadow-lg' : ''
            ]" />
          <button type="submit" :disabled="isSubmitting" :class="[
            'absolute flex items-center gap-2 right-4 top-1/2 -translate-y-1/2 p-2 border-2 border-black rounded-full transition-all duration-500',
            isSubmitting && !success ? 'bg-black/50 cursor-not-allowed' : '',
            success && !isSubmitting ? 'bg-[#10CD7E] hover:bg-[#10CD7E]/80 cursor-not-allowed scale-110' : 'bg-[#FF603E] hover:bg-[#FF603E]/80'
          ]" aria-label="Submit email">
            <svg v-if="!isSubmitting && !success" width="38" height="38" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            <svg v-if="isSubmitting" class="animate-spin" width="38" height="38" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.13232 17.1962 4.97066 19" stroke-opacity="0.75" />
            </svg>
            <svg v-if="success && !isSubmitting" width="38" height="38" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>
        </form>
        <!-- Success message with wave animation -->
        <Transition name="slide-fade">
          <div v-if="success" class="absolute -bottom-20 left-0 right-0 text-center">
            <div class="inline-block relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-[#FFDBFE] to-[#FF603E] rounded-lg blur opacity-25"></div>
              <div class="relative px-6 py-3 bg-white border-2 border-black rounded-lg">
                <p class="text-lg font-medium text-black">
                  {{ lang === 'ua' ? 'Дякуємо за підписку!' : 'Thank you for subscribing!' }}
                </p>
              </div>
            </div>
          </div>
        </Transition>
        <p v-if="lang === 'ua'" class="text-sm text-black/80 text-center mt-4">
          Відправляючи форму, ви автоматично погоджуєтеся <br>із <a href="#" @click.prevent="showPrivacyModal = true"
            class="underline">політикою
            конфіденційності</a> та <a href="#" @click.prevent="showTermsModal = true" class="underline">умовами
            використання</a>
        </p>
        <p v-else class="text-sm text-black/80 text-center mt-4">
          By submitting this form, you automatically agree <br>to our <a href="#"
            @click.prevent="showPrivacyModal = true" class="underline">privacy policy</a> and <a href="#"
            @click.prevent="showTermsModal = true" class="underline">terms of service</a>
        </p>
      </div>
    </main>
    <Footer />

    <Transition name="fade">
      <div v-if="showPrivacyModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <Transition name="slide-up">
          <div v-if="showPrivacyModal"
            class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative overflow-hidden max-h-[80vh] overflow-y-auto">
            <button @click="showPrivacyModal = false" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <Policy :lang="lang" />
          </div>
        </Transition>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showTermsModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <Transition name="slide-up">
          <div v-if="showTermsModal"
            class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative overflow-hidden max-h-[80vh] overflow-y-auto">
            <button @click="showTermsModal = false" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <Terms :lang="lang" />
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  transform: translateY(100%);
}

.slide-up-leave-to {
  transform: translateY(100%);
}

.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  50%, 100% {
    transform: translateX(100%);
  }
}

.success-wave {
  position: absolute;
  width: 200%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: wave 1.5s infinite;
}
</style>
