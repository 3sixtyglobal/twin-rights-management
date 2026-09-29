export function TrustSubjectFlowDiagram() {
	return (
		<div
			style={{
				background: 'linear-gradient(135deg, #122457 0%, #0d1b43 100%)',
				borderRadius: '12px',
				padding: '16px',
				margin: '1rem 0 1.5rem'
			}}
		>
			<p style={{ margin: '0 0 12px', color: '#ffffff', fontWeight: 700 }}>
				Trust Subject Flow: from the consumer's information sources to a constraint
			</p>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
				<div style={{ background: '#4b84e0', borderRadius: '8px', padding: '10px 12px' }}>
					<strong>Consumer node</strong>
					<div style={{ marginTop: '6px', fontSize: '0.9rem' }}>
						A public information source entry holds the attributes to disclose, for example a role
						and a country.
					</div>
				</div>
				<div style={{ background: '#e8e8ea', borderRadius: '8px', padding: '10px 12px' }}>
					<strong>Provider node</strong>
					<div style={{ marginTop: '6px', fontSize: '0.9rem' }}>
						Holds the offer and, later, the agreement that carries the verified attributes.
					</div>
				</div>
				<div style={{ background: '#4b84e0', borderRadius: '8px', padding: '10px 12px' }}>
					<strong>1. PNP gathers the subject</strong>
					<div style={{ marginTop: '6px', fontSize: '0.9rem' }}>
						The negotiation point calls the information point with no policy and the public access
						mode, and hands the result to the trust component as the credential subject.
					</div>
				</div>
				<div style={{ background: '#e8e8ea', borderRadius: '8px', padding: '10px 12px' }}>
					<strong>2. PNP verifies the token</strong>
					<div style={{ marginTop: '6px', fontSize: '0.9rem' }}>
						Expiry, signature, revocation, issuer and subject are checked. The credential subject is
						kept on the negotiation and offered to the negotiator.
					</div>
				</div>
				<div style={{ background: '#4b84e0', borderRadius: '8px', padding: '10px 12px' }}>
					<strong>Signed verifiable credential</strong>
					<div style={{ marginTop: '6px', fontSize: '0.9rem' }}>
						Issued by the consumer organisation identity, it travels with the contract request
						message.
					</div>
				</div>
				<div style={{ background: '#e8e8ea', borderRadius: '8px', padding: '10px 12px' }}>
					<strong>3. PAP stores trustData</strong>
					<div style={{ marginTop: '6px', fontSize: '0.9rem' }}>
						At finalisation the agreement is created with the verified credential and its subject as
						trustData, beside the rules.
					</div>
				</div>
				<div
					style={{
						gridColumn: '1 / span 2',
						background: '#1a3370',
						color: '#eef4ff',
						borderRadius: '8px',
						padding: '10px 12px'
					}}
				>
					<strong>4. Enforcement on the provider</strong>
					<div style={{ marginTop: '6px', fontSize: '0.9rem' }}>
						The enforcement point forwards the agreement's trustData to the decision point, which
						spreads it over the information point output. Constraints read the attributes as
						$.subject.role from the information data source and the arbiter grants or denies.
					</div>
				</div>
			</div>
		</div>
	);
}
