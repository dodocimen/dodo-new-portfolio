;(() => {
  // Project deck state
  let currentIndex = 0
  const totalCards = 3

  // Get DOM elements
  const cards = document.querySelectorAll(".project-card")
  const modalOverlay = document.getElementById('projectModal')
  const modalCloseBtn = modalOverlay ? modalOverlay.querySelector('.project-modal__close') : null
  const modalTitle = modalOverlay ? modalOverlay.querySelector('#projectModalTitle') : null
  const modalPanels = modalOverlay ? modalOverlay.querySelectorAll('.project-panel') : []
  const modalTabs = modalOverlay ? modalOverlay.querySelectorAll('.project-tab') : []
  const modalBackLink = modalOverlay ? modalOverlay.querySelector('.project-back-link') : null

  // Update active card
  function updateActiveCard(newIndex) {
    // Remove active class from all cards
    cards.forEach((card) => card.classList.remove("is-active"))

    // Add active class to new card
    cards[newIndex].classList.add("is-active")

    // Update current index
    currentIndex = newIndex

    // Announce change for screen readers
    const announcement = `Project ${newIndex + 1} of ${totalCards} selected`
    announceToScreenReader(announcement)
  }

  // Navigate to previous card
  function goToPrevious() {
    const newIndex = currentIndex === 0 ? totalCards - 1 : currentIndex - 1
    updateActiveCard(newIndex)
  }

  // Navigate to next card
  function goToNext() {
    const newIndex = currentIndex === totalCards - 1 ? 0 : currentIndex + 1
    updateActiveCard(newIndex)
  }

  // Announce to screen readers
  function announceToScreenReader(message) {
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.style.position = "absolute"
    announcement.style.left = "-10000px"
    announcement.style.width = "1px"
    announcement.style.height = "1px"
    announcement.style.overflow = "hidden"
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  // Event listeners (controls removed)

  // Keyboard navigation
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      goToPrevious()
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      goToNext()
    }
  })

  // Initialize
  updateActiveCard(0)

  // Lightweight lazy loader for images using data-src to optimize performance
  ;(() => {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    const candidates = Array.from(document.querySelectorAll('img[data-src]'))
    if (!candidates.length) return

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const el = entry.target
          const src = el.getAttribute('data-src')
          if (src) {
            const tmp = new Image()
            tmp.decoding = 'async'
            tmp.onload = () => { el.src = src }
            tmp.src = src
            el.removeAttribute('data-src')
          }
          obs.unobserve(el)
        })
      }, { rootMargin: '200px 0px', threshold: 0.01 })
      candidates.forEach(img => io.observe(img))
    } else {
      candidates.forEach(img => {
        const src = img.getAttribute('data-src')
        if (src) img.src = src
        img.removeAttribute('data-src')
      })
    }
  })()

  // Brand click to scroll to top
  const brandElement = document.querySelector('.brand')
  if (brandElement) {
    brandElement.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
    
    brandElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  // ----- Project modal logic -----
  function openProjectModal(index) {
    if (!modalOverlay) return
    modalOverlay.classList.add('is-open')
    modalOverlay.setAttribute('aria-hidden', 'false')
    setProjectTab(index)
    // Apply per-project modal theme class
    const stack = modalOverlay.querySelector('.project-modal-stack')
    if (stack) {
      stack.classList.remove('theme-proj-0','theme-proj-1','theme-proj-2')
      stack.classList.add(`theme-proj-${index}`)
    }
    // Add modal-open class to reduce background work
    document.documentElement.classList.add('modal-open')
    // Prevent background scroll on mobile
    if (window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
    }
  }

  function closeProjectModal() {
    if (!modalOverlay) return
    modalOverlay.classList.remove('is-open')
    modalOverlay.setAttribute('aria-hidden', 'true')
    // Remove modal-open class
    document.documentElement.classList.remove('modal-open')
    // Restore background scroll on mobile
    if (window.innerWidth <= 768) {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }

  function setProjectTab(index) {
    if (!modalOverlay) return
    // Title
    if (modalTitle) modalTitle.textContent = `Project ${index + 1}`
    // Tabs
    modalTabs.forEach((tab) => {
      const i = parseInt(tab.getAttribute('data-index') || '0', 10)
      const isActive = i === index
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false')
      tab.classList.toggle('is-active', isActive)
    })
    // Panels
    modalPanels.forEach((panel) => {
      const i = parseInt(panel.getAttribute('data-index') || '0', 10)
      panel.hidden = i !== index
    })
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal)
  }

  if (modalBackLink) {
    modalBackLink.addEventListener('click', (e) => {
      e.preventDefault()
      closeProjectModal()
    })
  }

  

  // Close button functionality
  const closeBtns = modalOverlay ? modalOverlay.querySelectorAll('.project-close-btn') : []
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeProjectModal)
  })

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeProjectModal()
    })
  }

  modalTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const i = parseInt(tab.getAttribute('data-index') || '0', 10)
      setProjectTab(i)
      const stack = modalOverlay.querySelector('.project-modal-stack')
      if (stack) {
        stack.classList.remove('theme-proj-0','theme-proj-1','theme-proj-2')
        stack.classList.add(`theme-proj-${i}`)
      }
    })
  })

  // Open modal when clicking an active card's title link
  document.addEventListener('click', (e) => {
    const link = e.target && e.target.closest && e.target.closest('.card-title-link')
    if (!link) return
    e.preventDefault()
    const card = link.closest('.project-card')
    if (!card) return
    const index = parseInt(card.getAttribute('data-index') || '0', 10)
    openProjectModal(index)
  })

  // Back/Next navigation inside modal header
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      const target = e.target
      if (!(target instanceof Element)) return
      const back = target.closest('.project-back-link')
      const next = target.closest('.project-next-link')
      if (!back && !next) return
      e.preventDefault()
      const activeTab = Array.from(modalTabs).find((t) => t.getAttribute('aria-selected') === 'true')
      const current = activeTab ? parseInt(activeTab.getAttribute('data-index') || '0', 10) : 0
      let nextIndex = current
      if (back && current > 0) nextIndex = current - 1
      if (next && current < totalCards - 1) nextIndex = current + 1
      if (nextIndex !== current) {
        setProjectTab(nextIndex)
        const stack = modalOverlay.querySelector('.project-modal-stack')
        if (stack) {
          stack.classList.remove('theme-proj-0','theme-proj-1','theme-proj-2')
          stack.classList.add(`theme-proj-${nextIndex}`)
        }
        // Ensure the right panel header is visible after switch
        const content = modalOverlay.querySelector('.project-modal__content')
        if (content) content.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  // Wave animation trigger: start on mouseenter, let it finish
  const headerTitle = document.querySelector('.header-title')
  const waveEmoji = document.querySelector('.wave-emoji')
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (headerTitle && waveEmoji && !prefersReduced) {
    let hoverActive = false

    // Track whether the emoji is currently animating
    waveEmoji.addEventListener('animationstart', () => {
      waveEmoji.classList.add('is-animating')
    })

    waveEmoji.addEventListener('animationend', (e) => {
      waveEmoji.classList.remove('is-animating')
      if (e && e.animationName === 'waveHover') {
        headerTitle.classList.remove('is-waving')
      }
      if (e && e.animationName === 'waveOnce') {
        // Clean up the initial wave-once class after first run
        waveEmoji.classList.remove('wave-once')
      }
    })

    waveEmoji.addEventListener('animationcancel', () => {
      waveEmoji.classList.remove('is-animating')
      headerTitle.classList.remove('is-waving')
    })

    headerTitle.addEventListener('mouseenter', () => {
      if (hoverActive) return
      // Don't start a new wave if one is already running (including initial waveOnce)
      if (waveEmoji.classList.contains('is-animating')) return
      hoverActive = true
      headerTitle.classList.add('is-waving')
    })

    headerTitle.addEventListener('mouseleave', () => {
      // Allow new trigger on next distinct hover
      hoverActive = false
    })
  }

  // Ensure modal images default to lazy/async decoding
  ;(() => {
    const modalImgs = document.querySelectorAll('.project-modal__content img')
    modalImgs.forEach(img => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading','lazy')
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding','async')
    })
  })()

  // Dynamic color palettes for cards and floating gradient
  // Define separate palettes for light and dark themes, 4 each
  const lightPalettes = [
    {
      cards: [
        ['rgba(102, 126, 234, 0.25)', 'rgba(118, 75, 162, 0.25)'],
        ['rgba(240, 147, 251, 0.25)', 'rgba(245, 87, 108, 0.25)'],
        ['rgba(79, 172, 254, 0.00)', 'rgba(0, 242, 254, 0.25)'],
      ],
      float: ['rgba(157, 102, 234, 0.763)', 'rgba(0, 200, 255, 0.14)', 'rgba(79, 172, 254, 0.04)', 'rgba(118, 75, 162, 0.02)'],
    },
    {
      cards: [
        ['rgba(255, 175, 189, 0.25)', 'rgba(255, 195, 160, 0.25)'], // peach → apricot
        ['rgba(196, 255, 247, 0.25)', 'rgba(168, 237, 234, 0.25)'], // mint → aqua
        ['rgba(129, 236, 236, 0.10)', 'rgba(116, 185, 255, 0.25)'], // cyan → blue
      ],
      float: ['rgba(0, 255, 98, 0.76)', 'rgba(168, 237, 233, 0.15)', 'rgba(116, 185, 255, 0.08)', 'rgba(99, 110, 114, 0.04)'],
    },
    {
      cards: [
        ['rgba(255, 204, 112, 0.25)', 'rgba(255, 159, 67, 0.25)'], // gold → orange
        ['rgba(108, 92, 231, 0.20)', 'rgba(162, 155, 254, 0.25)'], // indigo → lavender
        ['rgba(85, 239, 196, 0.15)', 'rgba(0, 206, 201, 0.25)'], // green → teal
      ],
      float: ['rgb(255, 166, 0)', 'rgba(162, 155, 254, 0.13)', 'rgba(0, 206, 201, 0.10)', 'rgba(45, 52, 54, 0.04)'],
    },
    {
      cards: [
        ['rgba(255, 118, 117, 0.25)', 'rgba(214, 48, 49, 0.25)'], // coral → red
        ['rgba(9, 132, 227, 0.20)', 'rgba(0, 206, 201, 0.25)'], // blue → teal
        ['rgba(253, 121, 168, 0.20)', 'rgba(232, 67, 147, 0.25)'], // pink range
      ],
      float: ['rgba(255, 0, 0, 0.84)', 'rgba(9, 133, 227, 0.12)', 'rgba(232, 67, 147, 0.08)', 'rgba(99, 110, 114, 0.04)'],
    },
  ]

  const darkPalettes = [
    {
      cards: [
        ['rgba(102, 126, 234, 0.18)', 'rgba(118, 75, 162, 0.22)'],
        ['rgba(240, 147, 251, 0.18)', 'rgba(245, 87, 108, 0.22)'],
        ['rgba(79, 172, 254, 0.00)', 'rgba(0, 242, 254, 0.18)'],
      ],
      float: ['rgba(157, 102, 234, 0.50)', 'rgba(0, 200, 255, 0.32)', 'rgba(79, 172, 254, 0.10)', 'rgba(118, 75, 162, 0.08)'],
    },
    {
      cards: [
        ['rgba(255, 175, 189, 0.18)', 'rgba(255, 195, 160, 0.22)'],
        ['rgba(196, 255, 247, 0.16)', 'rgba(168, 237, 234, 0.22)'],
        ['rgba(129, 236, 236, 0.08)', 'rgba(116, 185, 255, 0.18)'],
      ],
      float: ['rgba(0, 255, 98, 0.42)', 'rgba(168, 237, 233, 0.28)', 'rgba(116, 185, 255, 0.14)', 'rgba(99, 110, 114, 0.10)'],
    },
    {
      cards: [
        ['rgba(255, 204, 112, 0.18)', 'rgba(255, 159, 67, 0.22)'],
        ['rgba(108, 92, 231, 0.16)', 'rgba(162, 155, 254, 0.22)'],
        ['rgba(85, 239, 196, 0.12)', 'rgba(0, 206, 201, 0.20)'],
      ],
      float: ['rgb(255, 166, 0)', 'rgba(162, 155, 254, 0.26)', 'rgba(0, 206, 201, 0.18)', 'rgba(45, 52, 54, 0.12)'],
    },
    {
      cards: [
        ['rgba(255, 118, 117, 0.18)', 'rgba(214, 48, 49, 0.22)'],
        ['rgba(9, 132, 227, 0.16)', 'rgba(0, 206, 201, 0.22)'],
        ['rgba(253, 121, 168, 0.16)', 'rgba(232, 67, 147, 0.22)'],
      ],
      float: ['rgba(255, 0, 0, 0.48)', 'rgba(9, 133, 227, 0.24)', 'rgba(232, 67, 147, 0.20)', 'rgba(99, 110, 114, 0.12)'],
    },
  ]

  function applyPalette(palette) {
    const root = document.documentElement
    root.style.setProperty('--card0-start', palette.cards[0][0])
    root.style.setProperty('--card0-end', palette.cards[0][1])
    root.style.setProperty('--card1-start', palette.cards[1][0])
    root.style.setProperty('--card1-end', palette.cards[1][1])
    root.style.setProperty('--card2-start', palette.cards[2][0])
    root.style.setProperty('--card2-end', palette.cards[2][1])

    root.style.setProperty('--float-stop0', palette.float[0])
    root.style.setProperty('--float-stop1', palette.float[1])
    root.style.setProperty('--float-stop2', palette.float[2])
    root.style.setProperty('--float-stop3', palette.float[3])
  }

  // Helpers to get/set current palette index per theme
  function isDark() { return document.documentElement.classList.contains('dark') }
  function getPalettes() { return isDark() ? darkPalettes : lightPalettes }
  function getStorageKey() { return isDark() ? 'paletteIndexDark' : 'paletteIndexLight' }

  function applyCurrentPalette(index) {
    const list = getPalettes()
    const safeIndex = Math.max(0, Math.min(index ?? 0, list.length - 1))
    localStorage.setItem(getStorageKey(), safeIndex.toString())
    applyPalette(list[safeIndex])
    // Update swatch pressed state
    document.querySelectorAll('.palette-switcher .swatch').forEach((b) => b.setAttribute('aria-pressed', 'false'))
    const btn = document.querySelector(`.palette-switcher .swatch[data-palette-index="${safeIndex}"]`)
    if (btn) btn.setAttribute('aria-pressed', 'true')
  }

  function applyRandomPaletteForCurrentTheme() {
    const list = getPalettes()
    const key = isDark() ? 'lastPaletteIndexDark' : 'lastPaletteIndexLight'
    const last = parseInt(localStorage.getItem(key) || '-1', 10)
    
    // Check if this is the first time (no stored palette)
    const isFirstTime = last === -1
    let next
    
    if (isFirstTime) {
      // Default to palette 2 on first launch
      next = 2
    } else {
      // Random palette on refresh, ensuring different from last
      next = Math.floor(Math.random() * list.length)
      if (list.length > 1) {
        let attempts = 0
        while (next === last && attempts < 5) {
          next = Math.floor(Math.random() * list.length)
          attempts++
        }
      }
    }
    
    localStorage.setItem(key, String(next))
    // also set current palette index so theme switching uses this selection
    localStorage.setItem(getStorageKey(), String(next))
    applyCurrentPalette(next)
  }

  function initializePaletteOnLoad() {
    applyRandomPaletteForCurrentTheme()
  }

  // About box text color change on scroll - only overlapping parts
  const aboutBox = document.querySelector('.about-box')
  const footer = document.querySelector('.site-footer')
  
  function handleScroll() {
    if (aboutBox && footer) {
      const aboutBoxRect = aboutBox.getBoundingClientRect()
      const footerRect = footer.getBoundingClientRect()
      
      // Check if about-box is overlapping with footer
      if (aboutBoxRect.bottom > footerRect.top) {
        // Create a mask effect - only the overlapping part will be visible
        const overlapHeight = aboutBoxRect.bottom - footerRect.top
        const totalHeight = aboutBoxRect.height
        
        if (overlapHeight > 0) {
          // Create a linear gradient mask that shows white only for the overlapping part
          const whitePercentage = Math.min((overlapHeight / totalHeight) * 100, 100)
          aboutBox.style.background = `linear-gradient(to bottom, var(--accent) 0%, var(--accent) ${100 - whitePercentage}%, #ffffff ${100 - whitePercentage}%, #ffffff 100%)`
          aboutBox.style.backgroundClip = 'text'
          aboutBox.style.webkitBackgroundClip = 'text'
          aboutBox.style.webkitTextFillColor = 'transparent'
        }
      } else {
        // Reset to normal styling
        aboutBox.style.background = ''
        aboutBox.style.backgroundClip = ''
        aboutBox.style.webkitBackgroundClip = ''
        aboutBox.style.webkitTextFillColor = ''
      }
    }
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll)
  
  // Initial check
  handleScroll()

  // Magnetic cursor effect for project cards
  const projectDeck = document.querySelector('.project-deck')
  const magneticRadius = 260 // px radius around cursor to attract cards (expanded)
  const maxTranslate = 28 // px, maximum pull distance (increased from 18)
  const maxRotate = 9 // deg, subtle rotation for depth (increased from 6)

  // Smooth lerp helper
  function lerp(start, end, t) {
    return start + (end - start) * t
  }

  const cardState = new Map()
  cards.forEach((card) => {
    cardState.set(card, { tx: 0, ty: 0, rot: 0 })
  })

  let rafId = null
  const floatAmplitude = { x: 6, y: 6, rot: 0.8 } // px/deg, subtle and lightweight
  const floatSpeed = { x: 0.00022, y: 0.00018, rot: 0.00016 } // per ms

  function animate(timestamp) {
    const t = typeof timestamp === 'number' ? timestamp : performance.now()
    cards.forEach((card) => {
      const magnet = cardState.get(card)
      const prev = card.__prev || { tx: 0, ty: 0, rot: 0 }
      const index = parseInt(card.getAttribute('data-index') || '0', 10)

      // Lightweight continuous drift (combined with magnetic pull)
      const driftX = Math.sin(t * floatSpeed.x + index * 0.9) * floatAmplitude.x
      const driftY = Math.cos(t * floatSpeed.y + index * 1.1) * floatAmplitude.y
      const driftRot = Math.sin(t * floatSpeed.rot + index * 0.7) * floatAmplitude.rot

      // Final targets combine drift + magnet for seamless effect
      const targetTx = (magnet?.tx || 0) + driftX
      const targetTy = (magnet?.ty || 0) + driftY
      const targetRot = (magnet?.rot || 0) + driftRot

      const smoothTx = lerp(prev.tx, targetTx, 0.18)
      const smoothTy = lerp(prev.ty, targetTy, 0.18)
      const smoothRot = lerp(prev.rot, targetRot, 0.18)
      card.style.setProperty('--tx', `${smoothTx}px`)
      card.style.setProperty('--ty', `${smoothTy}px`)
      card.style.setProperty('--rot', `${smoothRot}deg`)
      card.__prev = { tx: smoothTx, ty: smoothTy, rot: smoothRot }
    })
    rafId = requestAnimationFrame(animate)
  }

  function updateMagnetEffect(event) {
    if (!projectDeck) return
    const cursorX = event.clientX
    const cursorY = event.clientY

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect()
      const cardCenterX = rect.left + rect.width / 2
      const cardCenterY = rect.top + rect.height / 2

      const dx = cursorX - cardCenterX
      const dy = cursorY - cardCenterY
      const distance = Math.hypot(dx, dy)

      if (distance < magneticRadius) {
        const falloff = 1 - Math.min(distance / magneticRadius, 1)
        const strength = Math.pow(falloff, 1.5) // smoother ramp-up near the cursor
        const normX = dx / (distance || 1)
        const normY = dy / (distance || 1)
        const pullX = normX * maxTranslate * strength
        const pullY = normY * maxTranslate * strength
        const rot = (normX * maxRotate) * strength
        cardState.set(card, { tx: pullX, ty: pullY, rot })
      } else {
        cardState.set(card, { tx: 0, ty: 0, rot: 0 })
      }
    })

    if (!rafId) {
      rafId = requestAnimationFrame(animate)
    }
  }

  function resetMagnetEffect() {
    cards.forEach((card) => cardState.set(card, { tx: 0, ty: 0, rot: 0 }))
    if (!rafId) {
      rafId = requestAnimationFrame(animate)
    }
  }

  if (projectDeck) {
    // Track pointer globally so attraction works outside the deck area
    window.addEventListener('pointermove', updateMagnetEffect)
    document.documentElement.addEventListener('pointerleave', resetMagnetEffect)
    window.addEventListener('blur', resetMagnetEffect)
  }

  // Cursor side + click-to-navigate on active card
  function updateActiveCardCursor(event) {
    const activeCard = document.querySelector('.project-card.is-active')
    if (!activeCard) return

    // If hovering the title link, let its own cursor apply
    if (event.target && event.target.closest && event.target.closest('.card-title-link')) {
      projectDeck.style.cursor = ''
      return
    }

    const rect = activeCard.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY
    const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom

    if (!inside) {
      projectDeck.style.cursor = ''
      return
    }

    const midX = rect.left + rect.width / 2
    projectDeck.style.cursor = x < midX ? 'w-resize' : 'e-resize'
  }

  function handleActiveCardClick(event) {
    const activeCard = document.querySelector('.project-card.is-active')
    if (!activeCard) return

    // Do not hijack clicks on the title link
    if (event.target && event.target.closest && event.target.closest('.card-title-link')) {
      return
    }

    const rect = activeCard.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY
    const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom

    if (!inside) return

    const midX = rect.left + rect.width / 2
    if (x < midX) {
      goToPrevious()
    } else {
      goToNext()
    }
  }

  if (projectDeck) {
    projectDeck.addEventListener('pointermove', updateActiveCardCursor)
    projectDeck.addEventListener('pointerleave', () => {
      projectDeck.style.cursor = ''
    })
    projectDeck.addEventListener('click', handleActiveCardClick)
  }
  
  // Mobile-only swipe to swap cards with real-time dragging (does not affect desktop)
  if (projectDeck) {
    let touchActive = false
    let startX = 0
    let currentX = 0
    let draggedCard = null

    const isMobileViewport = () => window.innerWidth <= 768

    projectDeck.addEventListener('pointerdown', (e) => {
      if (!isMobileViewport()) return
      const card = e.target && e.target.closest && e.target.closest('.project-card.is-active')
      if (!card) return
      // Only handle touch pointers (or touch-capable env)
      if (e.pointerType !== 'touch' && !('ontouchstart' in window)) return
      touchActive = true
      startX = e.clientX
      currentX = startX
      draggedCard = card
      draggedCard.setPointerCapture && draggedCard.setPointerCapture(e.pointerId)
      // Pause magnet while dragging
      window.removeEventListener('pointermove', updateMagnetEffect)
    })

    window.addEventListener('pointermove', (e) => {
      if (!touchActive || !draggedCard) return
      currentX = e.clientX
      const deltaX = currentX - startX
      // Apply real-time transform
      draggedCard.style.transition = 'transform 0s'
      draggedCard.style.transform = `translate(${deltaX}px, 0) rotate(${Math.max(-10, Math.min(10, deltaX / 20))}deg)`
    })

    function endDragInternal() {
      if (!draggedCard) return
      // Snap back smoothly if not swiped past threshold
      draggedCard.style.transition = 'transform 180ms ease'
      draggedCard.style.transform = ''
      setTimeout(() => {
        if (draggedCard) draggedCard.style.transition = ''
      }, 200)
    }

    function commitSwipe(deltaX) {
      if (!draggedCard) return
      const threshold = 80
      if (deltaX > threshold) {
        endDragInternal()
        goToNext()
      } else if (deltaX < -threshold) {
        endDragInternal()
        goToPrevious()
      } else {
        endDragInternal()
      }
    }

    function endDrag() {
      if (!touchActive) return
      const deltaX = currentX - startX
      commitSwipe(deltaX)
      touchActive = false
      // Resume magnet after drag
      window.addEventListener('pointermove', updateMagnetEffect)
      if (draggedCard && draggedCard.releasePointerCapture) {
        try { draggedCard.releasePointerCapture() } catch (_) {}
      }
      draggedCard = null
    }

    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
  }
  
  // Ensure animation runs even without pointer movement
  if (!rafId) {
    rafId = requestAnimationFrame(animate)
  }
  
  // Palette switcher events
  const paletteSwitcher = document.querySelector('.palette-switcher')
  if (paletteSwitcher) {
    paletteSwitcher.addEventListener('click', (e) => {
      const target = e.target
      if (!(target instanceof Element)) return
      const btn = target.closest('.swatch')
      if (!btn) return
      const idx = parseInt(btn.getAttribute('data-palette-index') || '0', 10)
      applyCurrentPalette(idx)
    })
  }

  // Dark mode toggles (support multiple)
  const themeToggle = document.querySelector('.theme-toggler')
  const modalThemeToggle = document.querySelector('.modal-theme-toggle')
  const rootElement = document.documentElement

  function applyTheme(isDark) {
    if (isDark) {
      rootElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to light mode')
        themeToggle.setAttribute('aria-pressed', 'true')
      }
      // Apply stored dark palette after theme change
      const idx = parseInt(localStorage.getItem('paletteIndexDark') || '2', 10)
      applyCurrentPalette(isNaN(idx) ? 2 : idx)
    } else {
      rootElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to dark mode')
        themeToggle.setAttribute('aria-pressed', 'false')
      }
      // Apply stored light palette after theme change
      const idx = parseInt(localStorage.getItem('paletteIndexLight') || '2', 10)
      applyCurrentPalette(isNaN(idx) ? 2 : idx)
    }
  }

  // Initialize theme from storage or prefers-color-scheme
  ;(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') {
      applyTheme(stored === 'dark')
      initializePaletteOnLoad()
      return
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(prefersDark)
    initializePaletteOnLoad()
  })()

  function handleToggle() {
    const isDark = rootElement.classList.contains('dark')
    applyTheme(!isDark)
  }

  // Wire up both toggles to global theme
  if (themeToggle) themeToggle.addEventListener('click', handleToggle)
  if (modalThemeToggle) modalThemeToggle.addEventListener('click', handleToggle)

  // Sync toggles ARIA state on load
  ;(() => {
    const dark = rootElement.classList.contains('dark')
    const pressed = dark ? 'true' : 'false'
    if (themeToggle) themeToggle.setAttribute('aria-pressed', pressed)
    if (modalThemeToggle) modalThemeToggle.setAttribute('aria-pressed', pressed)
  })()

  if (themeToggle) {
    themeToggle.addEventListener('click', handleToggle)
    themeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleToggle()
      }
    })
  }

  // Footer email copy-to-clipboard
  const emailBtn = document.querySelector('.footer-email')
  if (emailBtn) {
    emailBtn.addEventListener('click', async (e) => {
      const email = emailBtn.getAttribute('data-email') || emailBtn.textContent || ''
      try {
        await navigator.clipboard.writeText(email.trim())
      } catch (e) {
        // Fallback: create a temp input
        const input = document.createElement('input')
        input.value = email
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }

      // floating popup near cursor with random offset
      const { clientX, clientY } = e
      const float = document.createElement('div')
      float.className = 'copy-float'
      float.textContent = 'email copied 👍'

      // randomize offset for organic look
      const dx = (Math.random() * 24) - 12 // -12..12
      const dy = (Math.random() * 10) - 5  // -5..5
      float.style.left = `${clientX + dx}px`
      float.style.top = `${clientY + dy}px`
      document.body.appendChild(float)
      float.addEventListener('animationend', () => {
        if (float && float.parentNode) float.parentNode.removeChild(float)
      })
    })
  }
})()

// Final product countdown and disabled button state (fixed calendar target)
;(function(){
  const finalBtn = document.querySelector('.prototype-link--final')
  if (!finalBtn) return
  const countdownEl = document.getElementById('final-countdown')

  // enforce disabled visuals/behavior
  finalBtn.classList.add('is-disabled')
  finalBtn.setAttribute('aria-disabled', 'true')
  finalBtn.setAttribute('tabindex', '-1')
  finalBtn.addEventListener('click', (e) => { e.preventDefault() })

  // Fixed target date so countdown is identical for all visitors
  // Default target is from data-target attribute; fallback to now + 14 days
  const attr = countdownEl ? countdownEl.getAttribute('data-target') : null
  const fallbackTarget = Date.now() + (14 * 24 * 60 * 60 * 1000)
  const targetMs = attr ? Date.parse(attr) : fallbackTarget

  function formatRemaining(ms) {
    if (ms <= 0) return 'available soon'
    const dayMs = 24 * 60 * 60 * 1000
    const hourMs = 60 * 60 * 1000
    const days = Math.floor(ms / dayMs)
    const hours = Math.floor((ms % dayMs) / hourMs)
    return `available in ${days}d ${hours}h`
  }

  function updateCountdown() {
    if (!countdownEl) return
    const remaining = targetMs - Date.now()
    countdownEl.textContent = formatRemaining(remaining)
  }

  updateCountdown()
  setInterval(updateCountdown, 60 * 1000)
})()

// Minimal, dependency-free carousel
;(function(){
  function initCarousel(root){
    if(!root) return
    const data = root.getAttribute('data-images') || ''
    const sources = data.split('|').map(s => s.trim()).filter(Boolean)
    if(!sources.length) return
    const img = root.querySelector('.carousel-slide')
    const prev = root.querySelector('.carousel-prev')
    const next = root.querySelector('.carousel-next')
    let idx = 0

    function show(i){
      idx = (i + sources.length) % sources.length
      const src = sources[idx]
      if (img && img.getAttribute('src') !== src){
        const tmp = new Image()
        tmp.decoding = 'async'
        tmp.onload = () => { img.src = src; img.alt = `BetBot Research Summary slide ${idx+1}` }
        tmp.src = src
      }
      // expose current index for lightbox opener
      root.setAttribute('data-idx', String(idx))
    }

    prev && prev.addEventListener('click', (e)=>{ e.stopPropagation(); show(idx-1) })
    next && next.addEventListener('click', (e)=>{ e.stopPropagation(); show(idx+1) })

    // Keyboard support when focused (left/right only)
    root.setAttribute('tabindex','0')
    root.addEventListener('keydown', (e)=>{
      if (e.key === 'ArrowLeft') show(idx-1)
      else if (e.key === 'ArrowRight') show(idx+1)
    })

    // Lazy preload next image after first paint
    setTimeout(()=>{
      const pre = new Image();
      pre.decoding = 'async';
      pre.src = sources[1] || sources[0]
    }, 0)

    show(0)
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel').forEach(initCarousel)
  })
})()

// Minimal lightbox for images inside modal (excludes carousel and GIFs)
;(function(){
  const modalContent = document.querySelector('.project-modal__content')
  if (!modalContent) return

  function isGif(el){
    const src = (el.getAttribute('src') || '').toLowerCase()
    return src.endsWith('.gif')
  }

  function isCarouselImg(el){
    return !!el.closest('.carousel')
  }

  function openLightbox(images, startIndex){
    let index = Math.max(0, Math.min(startIndex || 0, images.length - 1))

    const overlay = document.createElement('div')
    overlay.className = 'lightbox-overlay'
    overlay.setAttribute('role','dialog')
    overlay.setAttribute('aria-modal','true')

    // stage wraps the image and arrows; click inside shouldn't close overlay
    const stage = document.createElement('div')
    stage.className = 'lightbox-stage'

    const img = document.createElement('img')
    img.className = 'lightbox-img'

    const closeBtn = document.createElement('button')
    closeBtn.className = 'lightbox-close'
    closeBtn.setAttribute('aria-label','Close')
    closeBtn.textContent = '×'

    // navigation arrows over the image
    const prevBtn = document.createElement('button')
    prevBtn.className = 'lightbox-arrow lightbox-prev'
    prevBtn.setAttribute('aria-label','Previous')
    prevBtn.textContent = '‹'

    const nextBtn = document.createElement('button')
    nextBtn.className = 'lightbox-arrow lightbox-next'
    nextBtn.setAttribute('aria-label','Next')
    nextBtn.textContent = '›'

    // Hide arrows for single images
    if (images.length <= 1) {
      prevBtn.style.display = 'none'
      nextBtn.style.display = 'none'
    }

    function render(){
      const item = images[index]
      img.src = item.src
      img.alt = item.alt || ''
    }

    function prev(){ index = (index - 1 + images.length) % images.length; render() }
    function next(){ index = (index + 1) % images.length; render() }

    function onKey(e){
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next() }
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); next() }
    }

    function close(){
      document.removeEventListener('keydown', onKey)
      overlay.removeEventListener('click', onOverlayClick)
      prevBtn.removeEventListener('click', onPrevClick)
      nextBtn.removeEventListener('click', onNextClick)
      stage.removeEventListener('click', onStageClick)
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay)
    }

    function onPrevClick(e){ e.stopPropagation(); prev() }
    function onNextClick(e){ e.stopPropagation(); next() }
    function onStageClick(e){ e.stopPropagation() }
    function onOverlayClick(){ close() }

    stage.appendChild(img)
    stage.appendChild(prevBtn)
    stage.appendChild(nextBtn)

    overlay.appendChild(stage)
    overlay.appendChild(closeBtn)
    document.body.appendChild(overlay)

    document.addEventListener('keydown', onKey)
    overlay.addEventListener('click', onOverlayClick)
    closeBtn.addEventListener('click', (e)=>{ e.stopPropagation(); close() })
    prevBtn.addEventListener('click', onPrevClick)
    nextBtn.addEventListener('click', onNextClick)
    stage.addEventListener('click', onStageClick)

    render()
  }

  modalContent.addEventListener('click', (e)=>{
    const target = e.target
    if (!(target instanceof HTMLImageElement)) return
    if (isGif(target)) return
    // Handle carousel images by opening group from data-images
    const carouselRoot = target.closest && target.closest('.carousel')
    if (carouselRoot){
      e.preventDefault()
      const data = carouselRoot.getAttribute('data-images') || ''
      const sources = data.split('|').map(s => s.trim()).filter(Boolean)
      if (sources.length){
        const start = parseInt(carouselRoot.getAttribute('data-idx') || '0', 10) || 0
        const images = sources.map(src => ({ src, alt: target.alt || '' }))
        openLightbox(images, start)
      }
      return
    }
    e.preventDefault()

    // Grouping: support duo and tri galleries
    const group = target.closest('.duo-gallery, .tri-gallery')
    if (group){
      const imgs = Array.from(group.querySelectorAll('img')).filter(Boolean)
      const images = imgs.map(img => ({ src: img.currentSrc || img.src, alt: img.alt || '' }))
      const startIndex = imgs.indexOf(target)
      openLightbox(images, startIndex)
    } else {
      openLightbox([{ src: target.currentSrc || target.src, alt: target.alt || '' }], 0)
    }
  })
})()


