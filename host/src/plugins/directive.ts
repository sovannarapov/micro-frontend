import {
  numberWithCommas,
  formatBytes,
  allowNumberOnly,
  allowNumberOnlyWithoutFullstop,
  allowEngOnly,
  clearCommas,
  clearChars,
  maskName,
  formatHHMMSS,
  checkPermission,
} from '../common/util/helpers';

export default defineNuxtPlugin(nuxtApp => {
  // selectbox에 all 추가
  nuxtApp.vueApp.directive('select-all', {
    mounted(el) {
      if (el) {
        const newOption = document.createElement('option');
        const optionText = document.createTextNode('All');

        newOption.appendChild(optionText);
        newOption.setAttribute('value', '');

        el.prepend(newOption);
      }
    },
  });

  const updateEls = el => {
    for (const option of el) {
      const text = option.innerText;
      const value = option.value;

      if (text !== 'All' && !option.innerText.includes(':')) option.innerText = `${value} : ${text}`;
    }
  };

  // selectbox option에 key:value 표시
  nuxtApp.vueApp.directive('select-mix', {
    mounted(el) {
      if (el) updateEls(el);
    },
    updated(el) {
      if (el) updateEls(el);
    },
  });

  // Bytes text 변환
  nuxtApp.vueApp.directive('format-bytes', {
    mounted(el) {
      el.innerText = formatBytes(el.innerText);
    },
  });

  // text trim
  nuxtApp.vueApp.directive('trim-text', {
    mounted(el, binding) {
      const elTxt = el.innerText;
      const { value } = binding;
      const trimmed = elTxt.length > value ? `${elTxt.slice(0, value)}...` : elTxt;

      el.innerText = trimmed;
      el.setAttribute('alt', elTxt);
    },
  });

  // add comma
  nuxtApp.vueApp.directive('util-add-comma', {
    updated(el, binding) {
      const { value } = binding;
      const tgts = el.querySelectorAll(`.${value}`);

      if (!tgts || !value) return false;

      for (const item of tgts) {
        const tgt = parseInt(item.innerText);

        if (!isNaN(tgt)) {
          if (tgt > 999) item.innerText = numberWithCommas(tgt);
        }
      }
    },
  });

  // number only
  nuxtApp.vueApp.directive('input-number-only', {
    mounted(el, binding, vnode) {
      const { value } = binding;
      const { ctx, props }: any = vnode;

      watch(
        () => ctx.proxy.modelValue,
        modelValue => {
          ctx.proxy.$el.value = ctx.proxy.$el.value.replace(/[^-0-9.]/g, '');
          ctx.update();
        },
        { deep: true, immediate: true },
      );

      el.addEventListener('focus', e => {
        setTimeout(() => {
          el.value = clearCommas(e.target.value);
          el.select();
        }, 0);
      });
      el.addEventListener('keypress', e => {
        allowNumberOnlyWithoutFullstop(e);
      });
      el.addEventListener('keyup', e => {
        el.value = el.value ? el.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '') : '';
      });
      el.addEventListener('blur', e => {
        el.value = value === undefined ? numberWithCommas(e.target.value) : e.target.value;
      });
    },
    updated(el, binding) {
      const { value } = binding;

      if (document.activeElement?.nodeName !== 'INPUT') {
        if (value === undefined) {
          setTimeout(() => {
            el.value = el.value ? numberWithCommas(clearCommas(el.value).replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '')) : el.value;
          }, 0);
        }
      }
    },
  });

  // number only
  nuxtApp.vueApp.directive('input-number', {
    mounted(el, binding) {
      el.addEventListener('focus', e => {
        setTimeout(() => {
          el.select();
        }, 0);
      });
      el.addEventListener('keypress', e => {
        allowNumberOnly(e);
      });
      el.addEventListener('keyup', e => {
        el.value = el.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
      });
    },
    updated(el, binding) {
      const mx = parseInt(el.getAttribute('maxlength'));

      if (document.activeElement?.nodeName !== 'INPUT') {
        if (el.value) {
          el.value = el.value ? parseInt(el.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '')) : el.value;
          el.value = mx && mx > 0 ? el.value.slice(0, mx) : el.value;
        }
      }
    },
  });

  // text only
  nuxtApp.vueApp.directive('input-text-only', {
    mounted(el, binding) {
      el.addEventListener('keypress', e => {
        allowEngOnly(e);
      });
      el.addEventListener('keyup', e => {
        el.value = el.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
      });
    },
    updated(el, binding) {
      const mx = parseInt(el.getAttribute('maxlength'));

      if (document.activeElement?.nodeName !== 'INPUT') {
        if (el.value) {
          el.value = el.value ? el.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣0-9]/g, '') : '';
          el.value = mx && mx > 0 ? el.value.slice(0, mx) : el.value;
        }
      }
    },
  });

  const onBlurAddComma = (el, props, value) => {
    const fixedNumbs = el.value?.split('.');
    const maxLen = props?.max;
    const [f, l] = fixedNumbs;

    // 정수가 maxlength 이상으로 입력됬을 경우 삭제
    if (f && f.length > maxLen) {
      el.value = f.slice(0, maxLen) + (l ? '.' + l : '');
    }

    el.value = numberWithCommas(el.value, value);
  };

  // input add comma
  nuxtApp.vueApp.directive('input-add-comma', {
    mounted(el, binding, vnode) {
      const { arg, value } = binding; // 소숫점 자리수
      const { ctx, props }: any = vnode;

      watch(
        () => ctx.proxy.modelValue,
        modelValue => {
          ctx.proxy.$el.value = ctx.proxy.$el.value.replace(/[^-0-9.]/g, '');
          ctx.update();
          if (el.getAttribute('disabled') !== null) {
            onBlurAddComma(el, props, value);
          }
        },
        { deep: true, immediate: true },
      );

      el.addEventListener('focus', () => {
        setTimeout(() => {
          el.value = clearCommas(el.value);
          el.select();
        }, 0);
      });

      el.addEventListener('blur', () => {
        onBlurAddComma(el, props, value);
      });

      el.addEventListener('keypress', e => {
        allowNumberOnly(e);
      });

      el.addEventListener('keyup', e => {
        const fixedNumbs = el.value?.split('.');
        const [f, l] = fixedNumbs;
        const detectNegative = arg !== 'positive' ? (f.indexOf('-') === 0 ? '-' : '') : '';
        const kRemovedF = clearChars(f);
        const kRemovedl = l ? clearChars(l) : '';

        // 소수점이 없을 경우
        if (!l) {
          el.value = detectNegative + clearChars(el.value);
        }

        // 소수점이 있고 지정된 길이 이상으로 입력되지 않은 경우
        if (l && l.length <= value) {
          el.value = detectNegative + kRemovedF + '.' + kRemovedl;
        }

        // 소수점이 지정된 길이 이상으로 입력됬을 경우 삭제
        if (l && l.length > value) {
          el.value = detectNegative + kRemovedF + '.' + kRemovedl.slice(0, value);
        }
      });

      window.setTimeout(() => {
        el.value = numberWithCommas(el.value, value);
      }, 0);
    },
    updated(el, binding, vnode) {
      const { arg, value } = binding;
      const { ctx, props }: any = vnode;

      if (document.activeElement?.nodeName !== 'INPUT') {
        // 정수만 입력 가능 할 경우
        el.value = arg === 'positive' && el.value.indexOf('-') !== -1 ? el.value.replace(/-/gi, '') : el.value;

        setTimeout(() => {
          el.value = numberWithCommas(el.value.replace(/,/gi, ''), value);
        }, 0);
      }
    },
  });

  // mask name
  nuxtApp.vueApp.directive('input-mask-name', {
    mounted(el, binding) {},
    updated(el, binding) {
      el.value = maskName(el.value);
    },
  });

  // formatHHMMSS
  nuxtApp.vueApp.directive('input-format-time', {
    mounted(el, binding) {
      el.addEventListener('keypress', e => {
        allowNumberOnly(e);
      });
      el.addEventListener('keyup', e => {
        allowNumberOnly(e);
        el.value = formatHHMMSS(el.value);
      });
      el.value = formatHHMMSS(el.value);
    },
    updated(el, binding) {
      el.value = formatHHMMSS(el.value);
    },
  });

  // prevent drag drop
  nuxtApp.vueApp.directive('prevent-drag', {
    mounted(el, binding) {
      el.addEventListener('dragstart', e => {
        e.preventDefault();
      });
      el.addEventListener('drop', e => {
        e.preventDefault();
      });
    },
  });

  //permission 
  nuxtApp.vueApp.directive('permission', {
    mounted(el, binding) {
      checkPermission(el,binding)
    },
    updated(el, binding) {
     checkPermission(el,binding)   
    },
  });
});
