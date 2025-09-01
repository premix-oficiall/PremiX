// Variável para controlar a etapa atual
let currentStep = 1;

// Função para inicializar a página
document.addEventListener("DOMContentLoaded", function() {
    // Inicializar a primeira etapa como ativa
    updateTimeline();
    
    // Adicionar máscaras aos campos
    addCPFMask();
    addCNPJMask();
    
    // Adicionar validação aos formulários
    setupFormValidation();
});

// Função para avançar para a próxima etapa
function nextStep(step) {
    if (validateCurrentStep(step)) {
        // Marcar etapa atual como concluída
        markStepCompleted(step);
        
        // Avançar para próxima etapa
        currentStep = step + 1;
        showStep(currentStep);
        updateTimeline();
        updateFormHeader();
    }
}

// Função para voltar para a etapa anterior
function prevStep(step) {
    currentStep = step - 1;
    showStep(currentStep);
    updateTimeline();
    updateFormHeader();
}

// Função para mostrar a etapa específica
function showStep(step) {
    // Esconder todas as etapas
    for (let i = 1; i <= 3; i++) {
        const stepContent = document.getElementById(`step-${i}-content`);
        if (stepContent) {
            stepContent.style.display = "none";
        }
    }
    
    // Mostrar a etapa atual
    const currentStepContent = document.getElementById(`step-${step}-content`);
    if (currentStepContent) {
        currentStepContent.style.display = "block";
    }
}

// Função para atualizar a linha do tempo
function updateTimeline() {
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step-${i}`);
        const line = document.getElementById(`line-${i}`);
        
        if (step) {
            step.classList.remove("active", "completed");
            
            if (i < currentStep) {
                step.classList.add("completed");
            } else if (i === currentStep) {
                step.classList.add("active");
            }
        }
        
        if (line) {
            line.classList.remove("active", "completed");
            
            if (i < currentStep) {
                line.classList.add("completed");
            } else if (i === currentStep && i < 4) {
                line.classList.add("active");
            }
        }
    }
}

// Função para marcar etapa como concluída
function markStepCompleted(step) {
    const stepElement = document.getElementById(`step-${step}`);
    if (stepElement) {
        stepElement.classList.remove("active");
        stepElement.classList.add("completed");
    }
    
    const lineElement = document.getElementById(`line-${step}`);
    if (lineElement) {
        lineElement.classList.add("completed");
    }
}

// Função para atualizar o cabeçalho do formulário
function updateFormHeader() {
    const formHeader = document.querySelector(".form-header");
    const headers = {
        1: { title: "Dados Pessoais", subtitle: "Vamos começar com suas informações básicas" },
        2: { title: "Dados da Empresa", subtitle: "Informe os dados da sua empresa para continuar" },
        3: { title: "Escolha seu Plano", subtitle: "Selecione o plano que melhor atende às suas necessidades" }
    };
    
    if (formHeader && headers[currentStep]) {
        formHeader.innerHTML = `
            <h2>${headers[currentStep].title}</h2>
            <p>${headers[currentStep].subtitle}</p>
        `;
    }
}

// Função para validar a etapa atual
function validateCurrentStep(step) {
    const form = document.getElementById(`step${step}Form`);
    if (!form) return false;
    
    const inputs = form.querySelectorAll("input[required], select[required]");
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add("error");
            showError(input, "Este campo é obrigatório");
        } else {
            input.classList.remove("error");
            hideError(input);
            
            // Validações específicas
            if (input.type === "email" && !isValidEmail(input.value)) {
                isValid = false;
                input.classList.add("error");
                showError(input, "Email inválido");
            }
            
            if (input.id === "cpf" && !isValidCPF(input.value)) {
                isValid = false;
                input.classList.add("error");
                showError(input, "CPF inválido");
            }
            
            if (input.id === "cnpj" && !isValidCNPJ(input.value)) {
                isValid = false;
                input.classList.add("error");
                showError(input, "CNPJ inválido");
            }
            
            if (input.id === "confirmar_senha" && input.value !== document.getElementById("senha").value) {
                isValid = false;
                input.classList.add("error");
                showError(input, "As senhas não coincidem");
            }
            
            if (input.id === "confirmar_senha_empresa" && input.value !== document.getElementById("senha_empresa").value) {
                isValid = false;
                input.classList.add("error");
                showError(input, "As senhas não coincidem");
            }
        }
    });
    
    return isValid;
}

// Função para mostrar erro
function showError(input, message) {
    hideError(input); // Remove erro anterior
    
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

// Função para esconder erro
function hideError(input) {
    const errorMessage = input.parentNode.querySelector(".error-message");
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar CPF
function isValidCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, "");
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    return digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10));
}

// Função para validar CNPJ
function isValidCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, "");
    if (cnpj.length !== 14) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    // Validar dígitos verificadores
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(cnpj.charAt(i)) * weights1[i];
    }
    let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    sum = 0;
    for (let i = 0; i < 13; i++) {
        sum += parseInt(cnpj.charAt(i)) * weights2[i];
    }
    let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    return digit1 === parseInt(cnpj.charAt(12)) && digit2 === parseInt(cnpj.charAt(13));
}

// Função para adicionar máscara ao CPF
function addCPFMask() {
    const cpfInput = document.getElementById("cpf");
    if (cpfInput) {
        cpfInput.addEventListener("input", function() {
            let value = this.value.replace(/\D/g, "");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            this.value = value;
        });
    }
}

// Função para adicionar máscara ao CNPJ
function addCNPJMask() {
    const cnpjInput = document.getElementById("cnpj");
    if (cnpjInput) {
        cnpjInput.addEventListener("input", function() {
            let value = this.value.replace(/\D/g, "");
            value = value.replace(/(\d{2})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1/$2");
            value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
            this.value = value;
        });
    }
}

// Função para configurar validação dos formulários
function setupFormValidation() {
    // Validação em tempo real para todos os inputs
    const allInputs = document.querySelectorAll("input, select");
    allInputs.forEach(input => {
        input.addEventListener("blur", function() {
            if (this.hasAttribute("required") && !this.value.trim()) {
                this.classList.add("error");
            } else {
                this.classList.remove("error");
                hideError(this);
            }
        });
        
        input.addEventListener("input", function() {
            if (this.classList.contains("error")) {
                this.classList.remove("error");
                hideError(this);
            }
        });
    });
    
    // Submissão do formulário final
    const step3Form = document.getElementById("step3Form");
    if (step3Form) {
        step3Form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const selectedPlan = document.querySelector("input[name=\"plano\"]:checked");
            if (!selectedPlan) {
                alert("Por favor, selecione um plano para continuar.");
                return;
            }
            
            // Simular finalização do cadastro e redirecionar para a tela de pagamento
            alert("Cadastro realizado com sucesso! Redirecionando para o pagamento...");
            // window.location.href = "./pagamento.html";
            
            // Aqui você pode adicionar a lógica para enviar os dados para o servidor
            console.log("Dados do cadastro:", {
                nomeChefe: document.getElementById("nome_chefe").value,
                email: document.getElementById("email").value,
                cpf: document.getElementById("cpf").value,
                nomeEmpresa: document.getElementById("nome_empresa").value,
                cnpj: document.getElementById("cnpj").value,
                plano: selectedPlan.value
            });
        });
    }
}

