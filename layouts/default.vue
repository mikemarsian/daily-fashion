<template>
  <div>
    <DFHeader></DFHeader>
    <main>
      <nuxt/>
      <DFLoginModal></DFLoginModal>
      <DFRegistrationModal></DFRegistrationModal>
      <DFCheckoutModal></DFCheckoutModal>
    </main>
  </div>
</template>

<script>
import DFHeader from '@/components/header/Header';
import DFLoginModal from '@/components/modal/Login';
import DFRegistrationModal from '@/components/modal/Registration';
import DFCheckoutModal from '@/components/modal/Checkout';

export default {
  components: {
    DFHeader,
    DFLoginModal,
    DFRegistrationModal,
    DFCheckoutModal
  }
}
</script>

<style>
</style>
