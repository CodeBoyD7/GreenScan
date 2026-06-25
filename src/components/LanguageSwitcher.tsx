import React, { useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Modal, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useI18n, LANG_NAMES, type Lang } from "../i18n";
import { Colors, BorderRadius, FontSize } from "../theme/colors";
import { ArrowDownIcon, CheckIcon } from "./Icons";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const handleSelect = (l: Lang) => {
    setLang(l);
    setOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
        style={styles.btn}
      >
        <Text style={styles.label}>{LANG_NAMES[lang]}</Text>
        <ArrowDownIcon size={10} color={Colors.primary} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>{t("select_language")}</Text>
            <ScrollView style={styles.langList}>
              {(Object.keys(LANG_NAMES) as Lang[]).map((l) => (
                <TouchableOpacity
                  key={l}
                  style={[styles.langOption, l === lang && styles.langOptionActive]}
                  onPress={() => handleSelect(l)}
                >
                  <Text style={[styles.langName, l === lang && styles.langNameActive]}>
                    {LANG_NAMES[l]}
                  </Text>
                  {l === lang && <CheckIcon size={18} color={Colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.primary,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: "60%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.foreground,
    marginBottom: 16,
  },
  langList: {
    gap: 4,
  },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
  },
  langOptionActive: {
    backgroundColor: "rgba(46,158,90,0.1)",
  },
  langName: {
    fontSize: FontSize.lg,
    fontWeight: "500",
    color: Colors.foreground,
  },
  langNameActive: {
    fontWeight: "700",
    color: Colors.primary,
  },

});
