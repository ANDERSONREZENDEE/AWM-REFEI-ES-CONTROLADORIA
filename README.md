# 🍽️ APP AWM REFEIÇÕES

Este é um Aplicativo Web Progressivo (**PWA**) desenvolvido para o controlo e registo individual de refeições em frentes de serviço da **WM Construções e Montagens**. O sistema foi desenhado para substituir formulários externos (como o KoboToolbox), oferecendo uma experiência offline e integrada.

## 🚀 Funcionalidades Principal

- **Modo Offline:** Funciona sem internet através de Service Workers.
- **Validação de CPF:** Impede o registo com CPFs matematicamente inválidos.
- **Campos Condicionais:** Exibe automaticamente campos de texto quando as opções "Outra Empresa", "Outra Função" ou "Outra Obra" são selecionadas.
- **Captura de Fotos:** Registo obrigatório da foto do local e da assinatura.
- **Relatório PDF:** Gera um documento formatado para partilha via WhatsApp.
- **Segurança:** Acesso restrito via palavra-passe (`wm2026`).

## 📁 Estrutura do Projeto

Para o funcionamento correto, a pasta do projeto deve conter:

```text
/
├── index.html          # O código principal (HTML/CSS/JS)
├── manifest.json       # Configurações de instalação no telemóvel
├── sw.js               # Motor para funcionamento offline
├── LOGOTIPO.jpg        # Logótipo da WM
├── icone_v3.png        # Ícone que aparecerá no menu do telemóvel
├── OLHOABERTO.png      # Ícone para mostrar senha
├── OLHOFECHADO_V2.png  # Ícone para ocultar senha
└── Captura de tela...  # Logótipo da Controladoria/Auditoria
