// order.ts

export type PaymentMethod = 'PIX' | 'CARTAO';
export type PaymentStatus = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO';

// Constantes de domínio usadas no front (e úteis p/ tipagem literal)
export const PRODUTO_FIXO = 'Hambúrguer CJ' as const;
export const VALOR_UNITARIO_FIXO = 45 as const; // 45,00

// Bloco comum de valores monetários do pedido
export interface OrderAmount {
    valorUnitario: number; // ex.: 45
    qtd: number;           // ex.: 1..n
    valorTotal: number;    // = qtd * valorUnitario
}

/**
 * Requisição de criação de pedido
 * Observação: `produto` é fixo e tipado como literal via typeof PRODUTO_FIXO
 */
export interface OrderCreateRequest extends OrderAmount {
    nomeCompleto: string;
    // email: string;
    telefone: string;
    produto: typeof PRODUTO_FIXO;    // "Hambúrguer CJ"
    opcaoPagamento: PaymentMethod;   // 'pix' | 'cartao'
}

/**
 * Resposta da criação de pedido
 * O backend retorna o meio de pagamento e, conforme o caso,
 * um QR Code (Pix) ou link de pagamento (Cartão).
 */
export interface OrderCreateResponse {
    id: string;
    opcaoPagamento: PaymentMethod;
    // Um dos dois abaixo será informado pelo backend
    qrCodeUrl?: string;   // ex: data:image/png;base64,... OU URL http(s)
    copiaECola?: string;   // ex: 145554545....55454545
    paymentLink?: string; // ex: https://gateway/pagar/...
}

/**
 * DTO de pedido para listagem/consulta
 */
export interface OrderDTO extends OrderAmount {
    id: string;
    numeroPedido: string;
    // cpf: string;
    nomeCompleto: string;
    apelido: string;
    // email: string;
    telefone: string;
    produto: typeof PRODUTO_FIXO;   // "Hambúrguer CJ"
    opcaoPagamento: PaymentMethod;
    statusPagamento: PaymentStatus; // default: PENDENTE
    createdDate: string;              // ISO
    updatedAt?: string;             // ISO (opcional, caso backend envie)
}

export interface OrdersResponse {
    orders: OrderDTO[];
    valorTotalConfirmado: number;
    valorTotalPendente: number;
    size: number;
}